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

pub struct Decoder {
    max: usize,
    reserved: usize,
    count: Option<u8>,
    pending: Option<(u8, u8)>,
    ended: bool,
    failed: bool,
}

impl Decoder {
    pub fn new(max_decoded_bytes: usize) -> Self {
        Self {
            max: max_decoded_bytes,
            reserved: 0,
            count: None,
            pending: None,
            ended: false,
            failed: false,
        }
    }

    pub fn push(&mut self, input: &[u8], output_limit: usize) -> Result<Decoded, Error> {
        if self.failed {
            return Err(Error::Failed);
        }
        if self.ended {
            if !input.is_empty() {
                self.failed = true;
                return Err(Error::TrailingData);
            }
            return Ok(Decoded {
                consumed: 0,
                bytes: Vec::new(),
                ended: true,
            });
        }
        let mut consumed = 0;
        let mut bytes = Vec::new();
        while bytes.len() < output_limit {
            if let Some((remaining, value)) = self.pending.take() {
                let n = usize::from(remaining).min(output_limit - bytes.len());
                bytes.resize(bytes.len() + n, value);
                if n < usize::from(remaining) {
                    self.pending = Some((remaining - n as u8, value));
                }
                continue;
            }
            if consumed == input.len() {
                break;
            }
            if let Some(count) = self.count.take() {
                let value = input[consumed];
                consumed += 1;
                let count = usize::from(count);
                if count > self.max - self.reserved {
                    self.failed = true;
                    return Err(Error::LimitExceeded);
                }
                self.reserved += count;
                self.pending = Some((count as u8, value));
            } else {
                let count = input[consumed];
                consumed += 1;
                if count == 0 {
                    if consumed != input.len() {
                        self.failed = true;
                        return Err(Error::TrailingData);
                    }
                    self.ended = true;
                    break;
                }
                self.count = Some(count);
            }
        }
        Ok(Decoded {
            consumed,
            bytes,
            ended: self.ended,
        })
    }

    pub fn finish(&mut self) -> Result<(), Error> {
        if self.failed {
            return Err(Error::Failed);
        }
        if self.ended {
            return Ok(());
        }
        self.failed = true;
        Err(Error::Truncated)
    }
}
