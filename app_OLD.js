console.log("JavaScript Loaded");

// MOBILE MENU - VANILLA JS
var showMenu = document.querySelector(".showmenu");
var closeMenu = document.querySelector(".closemenu");
var fullMenu = document.querySelector(".fullmenu");

showMenu.addEventListener("click", function () {
	fullMenu.classList.toggle("show");
});

closeMenu.addEventListener("click", function () {
	fullMenu.classList.toggle("show");
});

// DESKTOP MENU
const dropdowns = document.querySelectorAll(".w-dropdown");

dropdowns.forEach((dropdown) => {
	dropdown.addEventListener("mouseenter", function () {
		this.style.zIndex = "901";
		this.querySelector(".w-dropdown-toggle").classList.add("w--open");
		this.querySelector(".w-dropdown-list").classList.add("w--open");
	});

	dropdown.addEventListener("mouseleave", function () {
		this.style.zIndex = "";
		this.querySelector(".w-dropdown-toggle").classList.remove("w--open");
		this.querySelector(".w-dropdown-list").classList.remove("w--open");
	});
});

// HIGHLIGHT SHAPES FROM TEAM DROPDOWN
const teamContainers = document.querySelectorAll(".teamcontainer");

teamContainers.forEach((container) => {
	container.addEventListener("mouseenter", function () {
		const colorCircle = this.querySelector(".color-circle");
		if (colorCircle) colorCircle.style.opacity = "1";
	});

	container.addEventListener("mouseleave", function () {
		const colorCircle = this.querySelector(".color-circle");
		if (colorCircle) colorCircle.style.opacity = "";
	});
});

// MOBILE MENU - DROPDOWN ON CLICK
const dropdownNavLinks = document.querySelectorAll(".dropdown-navlink");

dropdownNavLinks.forEach((navLink) => {
	navLink.addEventListener("click", function () {
		const arrowDropdown = this.querySelector(".arrow-dropdown");
		const dropdownList = this.nextElementSibling;

		if (arrowDropdown) arrowDropdown.classList.toggle("rotate-0");
		if (dropdownList && dropdownList.classList.contains("dropdown-list-2")) {
			dropdownList.classList.toggle("height-auto");
		}
	});
});
