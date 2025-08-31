package handlers

import (
	"backend/scraper"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// AddCORS adds CORS headers to all responses
func AddCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func SearchProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}
	log.Printf("Searching for: %s", query)

	// Add artificial delay for loading state demo
	if r.URL.Query().Get("delay") == "true" {
		time.Sleep(1 * time.Second)
	}

	products, err := scraper.ScrapeDaraz(query)
	if err != nil {
		log.Printf("Error scraping products: %v", err)
		http.Error(w, "Failed to retrieve products", http.StatusInternalServerError)
		return
	}

	if len(products) == 0 {
		log.Printf("No products found for query: %s", query)
	} else {
		log.Printf("Found %d products for query: %s", len(products), query)
	}

	json.NewEncoder(w).Encode(products)
}

func GetProductDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	productID := params["id"]
	if productID == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	product, err := scraper.ScrapeProductDetailDaraz(productID)
	if err != nil {
		log.Printf("Error scraping product details: %v", err)
		http.Error(w, "Failed to retrieve product details", http.StatusInternalServerError)
		return
	}

	if product.Title == "" {
		log.Printf("No product details found for ID: %s", productID)
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	log.Printf("Retrieved details for product: %s", product.Title)
	json.NewEncoder(w).Encode(product)
}
