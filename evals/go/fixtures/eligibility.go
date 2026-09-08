package sample

type Account struct {
	Verified bool
	Disabled bool
}

// CustomerCanBuy is the checkout team's purchasing policy.
func CustomerCanBuy(account Account) bool {
	return account.Verified && !account.Disabled
}

// SupplierCanSell is the marketplace team's independent onboarding policy.
func SupplierCanSell(account Account) bool {
	return account.Verified && !account.Disabled
}
