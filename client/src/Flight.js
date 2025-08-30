import React from "react";

export default function Flight() {
  return (
    <>
      <div className="row text-dark col-12 col-lg-6 mx-auto manage-flight-wrapper">
        <div className="col-12 text-white p-2 d-flex manage-flight-header">
          <h3 className="px-4"></h3>
        </div>
        <div className="bg-light col-12 p-4 manage-flight-body">
          {/* <form
            //   onSubmit={handleUpdateAirport}
            className="d-flex flex-wrap align-items-end gap-2"
          >
            <div className="col-12 position-relative col-md text-start">
              <label className="form-label m-0 fw-semibold">Destination</label>
              <input
                className="form-control border rounded"
                type="text"
                placeholder="Airport Name"
                //   value={selectedAirport.name}
                //   onChange={(e) =>
                //     setSelectedAirport({
                //       ...selectedAirport,
                //       name: e.target.value,
                //     })
                //   }
              />
            </div>

            <div className="col-12 position-relative col-md text-start">
              <label className="form-label m-0 fw-semibold">Origin</label>
              <input
                type="text"
                placeholder="Location"
                className="form-control border rounded"
                //   value={selectedAirport.location}
                //   onChange={(e) =>
                //     setSelectedAirport({
                //       ...selectedAirport,
                //       location: e.target.value,
                //     })
                //   }
              />
            </div>

            <div className="col-12 col-md text-start">
              <label className="form-label m-0 fw-semibold">
                Flight Number
              </label>
              <input
                placeholder="Flight Number"
                type="text"
                className="form-control"
                //   value={selectedAirport.code}
                //   onChange={(e) =>
                //     setSelectedAirport({
                //       ...selectedAirport,
                //       code: e.target.value,
                //     })
                //   }
              />
            </div>
            <div className="col-12 col-md">
              <button type="submit" className="btn btn-theme col-5 me-2">
                Update Airport
              </button>
              <button
                //   onClick={() => setSelectedAirport(null)}
                className="btn btn-warning col-5"
              >
                Reset
              </button>
            </div>
          </form> */}

          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div class="cart-item-card card mb-4">
                <div class="row g-0">
                  <div class="col-md-4">
                    {/* <!-- <img
                  src="./images/Palawan.jpg"
                  class="img-fluid h-100 object-fit-cover"
                  alt="Palawan"
                /> --> */}
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title fw-bold text-gradient">
                        Palawan - Nature's Last Frontier
                      </h5>
                      <p class="card-text">
                        3 Days / 2 Nights Package
                        <br />
                        Includes: El Nido Island Hopping, Coron Lake Tours,
                        Puerto Princesa Underground River
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span class="text-muted">Price per person:</span>
                          <h4 class="price-display mb-0">₱15,500</h4>
                        </div>
                        <div class="d-flex align-items-center quantity-controls">
                          <button class="btn btn-outline-secondary btn-sm me-2">
                            <i class="bi bi-dash"></i>
                          </button>
                          <span class="fw-bold mx-2">1</span>
                          <button class="btn btn-outline-secondary btn-sm me-3">
                            <i class="bi bi-plus"></i>
                          </button>
                          <button class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cart-summary-card card">
                <div class="card-body">
                  <h5 class="card-title mb-4">Order Summary</h5>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Palawan Package (1 person)</span>
                    <span>₱15,500</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Service Fee</span>
                    <span>₱500</span>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between mb-4">
                    <h5 class="fw-bold">Total</h5>
                    <h5 class="fw-bold price-display">₱16,000</h5>
                  </div>
                  <div class="d-grid gap-2">
                    <a
                      href="./checkout.html"
                      class="btn btn-primary btn-lg rounded-pill"
                    >
                      <i class="bi bi-credit-card me-2"></i>Proceed to Checkout
                    </a>
                    <a
                      href="./index.html"
                      class="btn btn-outline-primary rounded-pill"
                    >
                      <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
