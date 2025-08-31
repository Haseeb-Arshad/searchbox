package main

import (
	"backend/handlers"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	// Create router
	r := mux.NewRouter()

	// Apply CORS middleware
	r.Use(handlers.AddCORS)

	// Define API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/search", handlers.SearchProducts).Methods("GET", "OPTIONS")
	api.HandleFunc("/product/{id}", handlers.GetProductDetail).Methods("GET", "OPTIONS")

	// Set up the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}

	// Configure server with timeouts
	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server
	fmt.Printf("Starting server on port %s...\n", port)
	log.Fatal(srv.ListenAndServe())
}
