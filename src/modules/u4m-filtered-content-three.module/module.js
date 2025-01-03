
const wrapper = document.querySelector(".resourceList");
const pagination = document.querySelector(".pagination");
const items = Array.from(document.querySelectorAll(".resourceCard"));
let filteredItems = items;
let currPage = 1;
const TagSelect = document.querySelector(".resourceSelect");
const TopicSelect = document.querySelector(".topicSelect");
const searchField = document.querySelector(".resourceInput"); 

const featuredPost = document.querySelector(".featCardsOuter");
const filteredContntTopBnr = document.querySelector(".filteredContnt .topBnr");




function filterItems(el, keyword, type, category) {
	const title = el.querySelector(".restitle").innerText.toLowerCase();
	const hasKeyword = !keyword || title.includes(keyword);
	const isOfType = !type || el.classList.contains(type);
	const isOfcategory = !category || el.classList.contains(category);

	return hasKeyword && isOfType && isOfcategory ;
} 

function MainLogic() {
	const keyword = searchField.value;
	const type = TagSelect.value;
	const topic = TopicSelect.value;

	filteredItems = items.filter(el => filterItems(el, keyword, type,topic));
	currPage = 1;

	if (filteredItems.length !== 0) {
		pagination.style.display = "flex";
		setHTML(filteredItems);
	} else {
		pagination.style.display = "none";
    wrapper.innerHTML = "<p class='col statusCnt'>No Data Found.</p>";
	}
}

function calculatePagination(totalItems, currentPage = 1, pageSize = 6, maxPages = 4) {
	let startPage, endPage, totalPages = Math.ceil(totalItems / pageSize);

	if (currentPage < 1) {
		currentPage = 1;
	} else if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	if (totalPages <= maxPages) {
		startPage = 1;
		endPage = totalPages;
	} else {
		let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
		let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

		if (currentPage <= maxPagesBeforeCurrentPage) {
			startPage = 1;
			endPage = maxPages;
		} else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
			startPage = totalPages - maxPages + 1;
			endPage = totalPages;
		} else {
			startPage = currentPage - maxPagesBeforeCurrentPage;
			endPage = currentPage + maxPagesAfterCurrentPage;
		}
	}

	let startIndex = (currentPage - 1) * pageSize;
	let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
	let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(i => startPage + i);

	return {
		totalItems: totalItems,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: totalPages,
		startPage: startPage,
		endPage: endPage,
		startIndex: startIndex,
		endIndex: endIndex,
		pages: pages
	};
} 


function setHTML(items) {
	wrapper.innerHTML = "";
	pagination.innerHTML = "";

	const {
		totalItems,
		currentPage,
		pageSize,
		totalPages,
		startPage,
		endPage,
		startIndex,
		endIndex,
		pages
	} = calculatePagination(items.length, currPage, 9, 4);

	const nav = document.createElement("nav");
	nav.classList.add("relative", "z-0", "inline-flex", "rounded-md", "shadow-sm", "-space-x-px");

	let paginationHTML = "";
	paginationHTML += `<button ${currentPage === 1 && "disabled"} class="${currentPage === 1 ? "cursor-not-allowed" : "prev"} prevnext">\n<span class="material-symbols-outlined">chevron_left</span>\n</button>`;

	pages.forEach(page => {
		paginationHTML += currentPage === page
			? `<button class=" active para gray_border black_color light_bg z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium" page="${page}" disabled>${page}</button>`
		: `<button class="para gray_border black_color light_bg page bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" page="${page}">${page}</button>`;
	});

	paginationHTML += `<button ${currentPage === endPage && "disabled"} class="${currentPage === endPage ? "cursor-not-allowed" : "next"} prevnext">\n<span class="material-symbols-outlined">chevron_right</span>\n</button>`;

	nav.innerHTML = paginationHTML;
	pagination.append(nav);

	const start = (currentPage - 1) * pageSize;
	const end = currentPage * pageSize;
	items.slice(start, end).forEach(el => {
		wrapper.append(el);
	});
} 
TagSelect.addEventListener("change", f => {
	f.preventDefault();
	MainLogic(); 
}); 

TopicSelect.addEventListener("change", f => {
	f.preventDefault();
	MainLogic(); 
}); 

searchField.addEventListener("keyup", g => {
	g.preventDefault();
	MainLogic(); 
}); 


document.addEventListener("click", e => {  
	const $this = e.target; 
	if ($this.classList.contains("page")) {
		const pageNumber = $this.getAttribute("page");
		if (pageNumber) {
			currPage = parseInt(pageNumber);
			setHTML(filteredItems); 
		}
	}
	if ($this.classList.contains("next")) {
		currPage += 1;
		setHTML(filteredItems); 
	}
	if ($this.classList.contains("prev")) {
		currPage -= 1;
		setHTML(filteredItems); 
	} 
});

setHTML(filteredItems); 

