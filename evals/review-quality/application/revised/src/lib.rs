#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Error {
    Closed,
    Truncated,
    LimitExceeded,
    TrailingData,
    Failed,
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            Self::Closed => "closed",
            Self::Truncated => "truncated",
            Self::LimitExceeded => "limit exceeded",
            Self::TrailingData => "trailing data",
            Self::Failed => "failed",
        })
    }
}

impl std::error::Error for Error {}

#[derive(Default)]
pub struct Encoder {
    pending: Option<(u8, u8)>,
    closed: bool,
}

impl Encoder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn push(&mut self, input: &[u8]) -> Result<Vec<u8>, Error> {
        if self.closed {
            return Err(Error::Closed);
        }
        let mut output = Vec::new();
        for &byte in input {
            match self.pending {
                Some((count, value)) if value == byte => {
                    if count == 254 {
                        output.extend_from_slice(&[255, value]);
                        self.pending = None;
                    } else {
                        self.pending = Some((count + 1, value));
                    }
                }
                Some((count, value)) => {
                    output.extend_from_slice(&[count, value]);
                    self.pending = Some((1, byte));
                }
                None => self.pending = Some((1, byte)),
            }
        }
        Ok(output)
    }

    pub fn finish(&mut self) -> Result<Vec<u8>, Error> {
        if self.closed {
            return Ok(Vec::new());
        }
        self.closed = true;
        let mut output = Vec::new();
        if let Some((count, value)) = self.pending.take() {
            output.extend_from_slice(&[count, value]);
        }
        output.push(0);
        Ok(output)
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct Decoded {
    pub consumed: usize,
    pub bytes: Vec<u8>,
    pub ended: bool,
}

enum Phase {
    AwaitCount,
    AwaitValue(u8),
    Emit { remaining: u8, value: u8 },
    Ended,
    Failed,
}

pub struct Decoder {
    remaining_capacity: usize,
    phase: Phase,
}

impl Decoder {
    pub fn new(max_decoded_bytes: usize) -> Self {
        Self {
            remaining_capacity: max_decoded_bytes,
            phase: Phase::AwaitCount,
        }
    }

    pub fn push(&mut self, input: &[u8], output_limit: usize) -> Result<Decoded, Error> {
        let mut consumed = 0;
        let mut bytes = Vec::new();
        loop {
            match self.phase {
                Phase::Failed => return Err(Error::Failed),
                Phase::Ended => {
                    if consumed != input.len() {
                        self.phase = Phase::Failed;
                        return Err(Error::TrailingData);
                    }
                    break;
                }
                _ if bytes.len() == output_limit => break,
                Phase::Emit { remaining, value } => {
                    let n = usize::from(remaining).min(output_limit - bytes.len());
                    bytes.resize(bytes.len() + n, value);
                    self.phase = if n < usize::from(remaining) {
                        Phase::Emit {
                            remaining: remaining - n as u8,
                            value,
                        }
                    } else {
                        Phase::AwaitCount
                    };
                }
                Phase::AwaitCount | Phase::AwaitValue(_) if consumed == input.len() => break,
                Phase::AwaitValue(count) => {
                    let value = input[consumed];
                    consumed += 1;
                    if usize::from(count) > self.remaining_capacity {
                        self.phase = Phase::Failed;
                        return Err(Error::LimitExceeded);
                    }
                    self.remaining_capacity -= usize::from(count);
                    self.phase = Phase::Emit {
                        remaining: count,
                        value,
                    };
                }
                Phase::AwaitCount => {
                    let count = input[consumed];
                    consumed += 1;
                    self.phase = if count == 0 {
                        Phase::Ended
                    } else {
                        Phase::AwaitValue(count)
                    };
                }
            }
        }
        Ok(Decoded {
            consumed,
            bytes,
            ended: matches!(self.phase, Phase::Ended),
        })
    }

    pub fn finish(&mut self) -> Result<(), Error> {
        match self.phase {
            Phase::Failed => Err(Error::Failed),
            Phase::Ended => Ok(()),
            _ => {
                self.phase = Phase::Failed;
                Err(Error::Truncated)
            }
        }
    }
}
