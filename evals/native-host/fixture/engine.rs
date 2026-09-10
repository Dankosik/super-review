struct Policy { days: u32 }
impl Policy {
 fn duration(&self) -> i64 { i64::from(self.days) * 86400 }
}
fn deadline(policy: &Policy, epoch_seconds: i64) -> Option<i64> {
 epoch_seconds.checked_add(policy.duration())
}
// Local comment change.
