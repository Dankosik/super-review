/// Illustrates owned state transitions, explicit clock input, and typed domain
/// outcomes without persistence/HTTP imports or generic typestate ceremony.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OrderId(pub u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct UnixSeconds(pub i64);

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OrderState {
    Draft,
    Paid { paid_at: UnixSeconds, total_cents: i64 },
    Cancelled { cancelled_at: UnixSeconds },
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CancelOutcome {
    Cancelled { refund_cents: i64 },
    AlreadyCancelled,
    RefundWindowExpired,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Order {
    id: OrderId,
    state: OrderState,
}

impl Order {
    pub fn new(id: OrderId, state: OrderState) -> Self {
        Self { id, state }
    }

    pub fn id(&self) -> OrderId {
        self.id
    }

    pub fn state(&self) -> &OrderState {
        &self.state
    }

    pub fn cancel(&mut self, now: UnixSeconds, refund_window_secs: i64) -> CancelOutcome {
        match self.state {
            OrderState::Cancelled { .. } => CancelOutcome::AlreadyCancelled,
            OrderState::Draft => {
                self.state = OrderState::Cancelled { cancelled_at: now };
                CancelOutcome::Cancelled { refund_cents: 0 }
            }
            OrderState::Paid { paid_at, total_cents } => {
                if now.0 - paid_at.0 > refund_window_secs {
                    return CancelOutcome::RefundWindowExpired;
                }
                self.state = OrderState::Cancelled { cancelled_at: now };
                CancelOutcome::Cancelled { refund_cents: total_cents }
            }
        }
    }
}
