package invoice

func Total(subtotalCents, discountBasisPoints int64) int64 {
	discountCents := calculate(subtotalCents, discountBasisPoints)
	return subtotalCents - discountCents
}
