// console.log("JavaScript Loaded");

// ADD BLUE DOT TO HIGHLIGHT CURRENT PAGE
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

// AOS INITI
AOS.init();

// PHOTOSWIPE 4
// Parse gallery elements manually
(function () {
	var initPhotoSwipeFromDOM = function (gallerySelector) {
		var parseThumbnailElements = function (el) {
			var thumbElements = el.childNodes,
				numNodes = thumbElements.length,
				items = [],
				el,
				childElements,
				thumbnailEl,
				size,
				item;

			for (var i = 0; i < numNodes; i++) {
				el = thumbElements[i];

				// include only element nodes
				if (el.nodeType !== 1) {
					continue;
				}

				childElements = el.children;

				size = el.getAttribute("data-size").split("x");

				// create slide object
				item = {
					src: el.getAttribute("href"),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10),
					author: el.getAttribute("data-author"),
					title: el.getAttribute("data-title"),
				};

				item.el = el; // save link to element for getThumbBoundsFn

				if (childElements.length > 0) {
					item.msrc = childElements[0].getAttribute("src"); // thumbnail url
					if (childElements.length > 1) {
						item.title = childElements[1].innerHTML; // caption (contents of figure)
					}
				}

				var mediumSrc = el.getAttribute("data-med");
				if (mediumSrc) {
					size = el.getAttribute("data-med-size").split("x");
					// "medium-sized" image
					item.m = {
						src: mediumSrc,
						w: parseInt(size[0], 10),
						h: parseInt(size[1], 10),
					};
				}

				// original image
				item.o = {
					src: item.src,
					w: item.w,
					h: item.h,
				};

				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && (fn(el) ? el : closest(el.parentNode, fn));
		};

		var onThumbnailsClick = function (e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);

			var eTarget = e.target || e.srcElement;

			var clickedListItem = closest(eTarget, function (el) {
				return el.tagName === "A";
			});

			if (!clickedListItem) {
				return;
			}

			var clickedGallery = clickedListItem.parentNode;

			var childNodes = clickedListItem.parentNode.childNodes,
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			for (var i = 0; i < numChildNodes; i++) {
				if (childNodes[i].nodeType !== 1) {
					continue;
				}

				if (childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if (index >= 0) {
				openPhotoSwipe(index, clickedGallery);
			}
			return false;
		};

		var photoswipeParseHash = function () {
			var hash = window.location.hash.substring(1),
				params = {};

			if (hash.length < 5) {
				// pid=1
				return params;
			}

			var vars = hash.split("&");
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split("=");
				if (pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll(".pswp")[0],
				gallery,
				options,
				items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {
				galleryUID: galleryElement.getAttribute("data-pswp-uid"),

				getThumbBoundsFn: function (index) {
					// See Options->getThumbBoundsFn section of docs for more info
					var thumbnail = items[index].el.children[0],
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect();

					return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
				},

				addCaptionHTMLFn: function (item, captionEl, isFake) {
					if (!item.title) {
						captionEl.children[0].innerText = "";
						return false;
					}
					captionEl.children[0].innerHTML = item.title + "<br/><small>Photo: " + item.author + "</small>";
					return true;
				},
			};

			if (fromURL) {
				if (options.galleryPIDs) {
					// parse real index when custom PIDs are used
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for (var j = 0; j < items.length; j++) {
						if (items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if (isNaN(options.index)) {
				return;
			}

			var radios = document.getElementsByName("gallery-style");
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					if (radios[i].id == "radio-all-controls") {
					} else if (radios[i].id == "radio-minimal-black") {
						options.mainClass = "pswp--minimal--dark";
						options.barsSize = { top: 0, bottom: 0 };
						options.captionEl = false;
						options.fullscreenEl = false;
						options.shareEl = false;
						options.bgOpacity = 0.85;
						options.tapToClose = true;
						options.tapToToggleControls = false;
					}
					break;
				}
			}

			if (disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

			// see: http://photoswipe.com/documentation/responsive-images.html
			var realViewportWidth,
				useLargeImages = false,
				firstResize = true,
				imageSrcWillChange;

			gallery.listen("beforeResize", function () {
				var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
				dpiRatio = Math.min(dpiRatio, 2.5);
				realViewportWidth = gallery.viewportSize.x * dpiRatio;

				if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
					if (!useLargeImages) {
						useLargeImages = true;
						imageSrcWillChange = true;
					}
				} else {
					if (useLargeImages) {
						useLargeImages = false;
						imageSrcWillChange = true;
					}
				}

				if (imageSrcWillChange && !firstResize) {
					gallery.invalidateCurrItems();
				}

				if (firstResize) {
					firstResize = false;
				}

				imageSrcWillChange = false;
			});

			gallery.listen("gettingData", function (index, item) {
				if (useLargeImages) {
					item.src = item.o.src;
					item.w = item.o.w;
					item.h = item.o.h;
				} else {
					item.src = item.m.src;
					item.w = item.m.w;
					item.h = item.m.h;
				}
			});

			gallery.init();
		};

		// select all gallery elements
		var galleryElements = document.querySelectorAll(gallerySelector);
		for (var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute("data-pswp-uid", i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if (hashData.pid && hashData.gid) {
			openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
		}
	};

	// TARGET CLASS
	initPhotoSwipeFromDOM(".collection-gallery");
})();
