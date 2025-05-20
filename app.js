// console.log("JavaScript Loaded");

// TEST
document.addEventListener("DOMContentLoaded", function () {
	const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"
	const navLinks = document.querySelectorAll(".navlink.w-nav-link");

	navLinks.forEach((link) => {
		const linkPage = link.getAttribute("href").replace(/^\//, "");

		if (linkPage === currentPage) {
			link.classList.add("w--current");
		}
	});
});

// MOBILE MENU - ACCESSIBLE VERSION
const showMenu = document.querySelector(".showmenu");
const closeMenu = document.querySelector(".closemenu");
const fullMenu = document.querySelector(".fullmenu");

// Ensure buttons are focusable and have ARIA roles
showMenu.setAttribute("role", "button");
showMenu.setAttribute("tabindex", "0");
showMenu.setAttribute("aria-expanded", "false");
showMenu.setAttribute("aria-controls", "mainmenu");

closeMenu.setAttribute("role", "button");
closeMenu.setAttribute("tabindex", "0");
closeMenu.setAttribute("aria-label", "Close menu");

function toggleMenu(open) {
	fullMenu.classList.toggle("show", open);
	showMenu.setAttribute("aria-expanded", open ? "true" : "false");
	if (open) {
		fullMenu.focus(); // move focus to menu
	} else {
		showMenu.focus(); // return focus
	}
}

function handleKeyToggle(e, open) {
	if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
		e.preventDefault();
		toggleMenu(open);
	}
}

showMenu.addEventListener("click", () => toggleMenu(true));
showMenu.addEventListener("keydown", (e) => handleKeyToggle(e, true));

closeMenu.addEventListener("click", () => toggleMenu(false));
closeMenu.addEventListener("keydown", (e) => handleKeyToggle(e, false));

// DESKTOP MENU - ACCESSIBLE DROPDOWNS
const dropdowns = document.querySelectorAll(".w-dropdown");

dropdowns.forEach((dropdown) => {
	const toggle = dropdown.querySelector(".w-dropdown-toggle");
	const list = dropdown.querySelector(".w-dropdown-list");

	toggle.setAttribute("tabindex", "0");
	toggle.setAttribute("role", "button");
	toggle.setAttribute("aria-haspopup", "true");
	toggle.setAttribute("aria-expanded", "false");

	function openDropdown() {
		dropdown.style.zIndex = "901";
		toggle.classList.add("w--open");
		list.classList.add("w--open");
		toggle.setAttribute("aria-expanded", "true");
	}

	function closeDropdown() {
		dropdown.style.zIndex = "";
		toggle.classList.remove("w--open");
		list.classList.remove("w--open");
		toggle.setAttribute("aria-expanded", "false");
	}

	dropdown.addEventListener("mouseenter", openDropdown);
	dropdown.addEventListener("mouseleave", closeDropdown);

	toggle.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			const expanded = toggle.getAttribute("aria-expanded") === "true";
			if (expanded) {
				closeDropdown();
			} else {
				openDropdown();
			}
		}
	});
});

// MOBILE DROPDOWN LINKS - ACCESSIBLE TOGGLING
const dropdownNavLinks = document.querySelectorAll(".dropdown-navlink");

dropdownNavLinks.forEach((navLink) => {
	const dropdownList = navLink.nextElementSibling;
	const arrowDropdown = navLink.querySelector(".arrow-dropdown");

	navLink.setAttribute("tabindex", "0");
	navLink.setAttribute("role", "button");
	navLink.setAttribute("aria-haspopup", "true");
	navLink.setAttribute("aria-expanded", "false");

	function toggleDropdown() {
		const expanded = navLink.getAttribute("aria-expanded") === "true";
		navLink.setAttribute("aria-expanded", !expanded);
		if (arrowDropdown) arrowDropdown.classList.toggle("rotate-0");
		if (dropdownList && dropdownList.classList.contains("dropdown-list-2")) {
			dropdownList.classList.toggle("height-auto");
		}
	}

	navLink.addEventListener("click", toggleDropdown);
	navLink.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			toggleDropdown();
		}
	});
});

// PHOTOSWIPE 4
// Parse gallery elements manually

const initPhotoSwipeFromDOM = function (gallerySelector) {
	const parseThumbnailElements = function (el) {
		const thumbElements = el.querySelectorAll(".my-gallery-flex-item");
		const items = [];

		thumbElements.forEach((itemEl) => {
			const linkEl = itemEl.querySelector("a");
			const size = linkEl.getAttribute("data-size").split("x");
			const item = {
				src: linkEl.getAttribute("href"),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				msrc: linkEl.querySelector("img").getAttribute("src"),
				el: itemEl,
			};
			items.push(item);
		});

		return items;
	};

	const onThumbnailsClick = function (e) {
		e.preventDefault();
		const clickedItem = e.target.closest(".my-gallery-flex-item");
		if (!clickedItem) return;

		const clickedGallery = clickedItem.parentNode;
		const childNodes = Array.from(clickedGallery.querySelectorAll(".my-gallery-flex-item"));
		const index = childNodes.indexOf(clickedItem);
		if (index >= 0) openPhotoSwipe(index, clickedGallery);
	};

	const openPhotoSwipe = function (index, galleryElement) {
		const pswpElement = document.querySelectorAll(".pswp")[0];
		const items = parseThumbnailElements(galleryElement);
		const options = {
			index: index,
			bgOpacity: 0.9,
			showHideOpacity: true,
			// showHideOpacity: false,
		};
		const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

	const galleryElements = document.querySelectorAll(gallerySelector);
	galleryElements.forEach((galleryEl) => {
		galleryEl.addEventListener("click", onThumbnailsClick);
	});
};

initPhotoSwipeFromDOM(".my-gallery");
