document.addEventListener("DOMContentLoaded", async () => {
	const gallerySection = document.querySelector("#property");
	const detailsSection = document.querySelector("#property-details");
	const backToGallery = document.querySelector("#back-to-gallery");
	const gallery = document.querySelector("#property-gallery");
	const propertyInfo = document.querySelector(".property-info");

	const fetchData = async () => {
		const response = await fetch("data.json"); // Adjust the path if necessary
		return await response.json();
	};

	const renderProperties = async () => {
		const data = await fetchData();
		const properties = data.properties;

		gallery.innerHTML = properties
			.map(
				(property) => `
                    <div class="card">
                        <img src="${property.image}" alt="${property.name}">
                        <div class="card-content">
                            <h3>${property.name}</h3>
                            <a href="#" class="view-property" data-property="${property.id}">View Property</a>
                        </div>
                    </div>
                `,
			)
			.join("");
	};

	await renderProperties();

	gallery.addEventListener("click", async (e) => {
		if (e.target.classList.contains("view-property")) {
			e.preventDefault();
			const propertyId = e.target.getAttribute("data-property");
			const data = await fetchData();
			const property = data.properties.find(
				(p) => p.id === parseInt(propertyId),
			);

			const mainSwiperWrapper = document.querySelector("#main-swiper-wrapper");
			const thumbsSwiperWrapper = document.querySelector(
				"#thumbs-swiper-wrapper",
			);

			// Clear existing content
			mainSwiperWrapper.innerHTML = "";
			thumbsSwiperWrapper.innerHTML = "";
			propertyInfo.innerHTML = "";

			// Populate Swiper with images
			property.Images.forEach((img) => {
				mainSwiperWrapper.innerHTML += `
                    <div class="swiper-slide">
                        <img src="${img}" alt="Property Image">
                    </div>
                `;
				thumbsSwiperWrapper.innerHTML += `
                    <div class="swiper-slide">
                        <img src="${img}" alt="Thumbnail">
                    </div>
                `;
			});
			// Populate Property Info
			propertyInfo.innerHTML = `
				<h3>${property.name}</h3>
				<div class="property-info-list">
					<ul>
						<li><strong>Buy/Rent:</strong> ${property.details.buyOrRent}</li>
						<li><strong>Property Type:</strong> ${property.details.propertyType}</li>
						<li><strong>Region:</strong> ${property.details.region}</li>
						<li><strong>Neighborhood:</strong>
							<ul>
								${property.details.neighborhood
									.map((neighborhood) => `<li>${neighborhood}</li>`)
									.join("")}
							</ul>
						</li>
						<li><strong>Bedrooms:</strong> ${property.details.bedrooms}</li>
						<li><strong>Bathrooms:</strong> ${property.details.bathrooms}</li>
						<li><strong>Property Size:</strong> ${property.details.propertySize}</li>
						<li><strong>Lot Size:</strong> ${property.details.lotSize}</li>
						<li><strong>Price:</strong> ${property.details.price}</li>
					</ul>
					<ul>
						<li><strong>Features:</strong></li>
						${property.details.features.map((feature) => `<li>${feature}</li>`).join("")}
					</ul>
				</div>
			`;

			// Initialize Swiper
			const thumbsSwiper = new Swiper(".thumbs-swiper", {
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});

			const mainSwiper = new Swiper(".main-swiper", {
				spaceBetween: 10,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				thumbs: {
					swiper: thumbsSwiper,
				},
			});

			gallerySection.style.display = "none";
			detailsSection.style.display = "block";
		}
	});

	backToGallery.addEventListener("click", () => {
		detailsSection.style.display = "none";
		gallerySection.style.display = "block";
	});
});
