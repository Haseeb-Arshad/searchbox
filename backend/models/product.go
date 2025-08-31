package models

// Product represents a search result item
type Product struct {
	ID                  string `json:"id"`
	Title               string `json:"title"`
	Image               string `json:"image"`
	StoreName           string `json:"storeName"`
	Price               string `json:"price,omitempty"`
	Rating              string `json:"rating,omitempty"`
	ReviewCount         string `json:"reviewCount,omitempty"`
	Seller              string `json:"seller,omitempty"`
	Link                string `json:"link,omitempty"`
	DetailedDescription string `json:"detailedDescription,omitempty"`
}

// ProductSearchResponse represents a collection of product search results
type ProductSearchResponse struct {
	Products   []Product `json:"products"`
	TotalCount int       `json:"totalCount"`
	Query      string    `json:"query"`
}
