package display

import "fmt"

type Invoice struct {
    Number string
    Cents int64
}

func InvoiceLabel(invoice Invoice) string {
    return fmt.Sprintf("%s: %d cents", invoice.Number, invoice.Cents)
}
