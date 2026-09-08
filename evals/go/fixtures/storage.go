package sample

import (
	"context"
	"fmt"
)

type Customer struct {
	ID string
}

// Store is the consumer's boundary to remote storage.
type Store interface {
	Get(context.Context, string) (Customer, error)
}

type CustomerService struct {
	store Store
}

func NewCustomerService(store Store) *CustomerService {
	return &CustomerService{store: store}
}

func (s *CustomerService) Customer(ctx context.Context, id string) (Customer, error) {
	customer, err := s.store.Get(ctx, id)
	if err != nil {
		return Customer{}, fmt.Errorf("load customer %q: %w", id, err)
	}
	return customer, nil
}

// RemoteStore is the only current implementation.
type RemoteStore struct {
	fetch func(context.Context, string) (Customer, error)
}

func (r RemoteStore) Get(ctx context.Context, id string) (Customer, error) {
	return r.fetch(ctx, id)
}
