const categoryNames = {
    1: 'User Account',
    2: 'Suburb',
    3: 'Weather',
    4: 'User & Suburb, Save & Alert',
    5: 'User & Weather Alert',
    6: 'Post Related'
};
const apiDocumentationLink = 'api_doc.csv'

const darkBackgroundColor = '#151515';
const darkFontColor = '#eeeeee';
const catalogue = document.getElementById('catalogue');
const erd = document.getElementById('erd');

document.addEventListener('DOMContentLoaded', ready);

async function ready() {
    const apiData = await loadApiDocumentation(apiDocumentationLink);
    loadPage(apiData);
    listenToColorScheme();
    handleMenuBtn();
    document.getElementById('title').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('api-0').scrollIntoView({behavior: 'smooth'});
    })
}

async function loadApiDocumentation(documentationLink) {
    return new Promise((resolve, reject) => {
        Papa.parse(documentationLink, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error),
        })
    })
}

function handleMenuBtn() {
    const menuBtn = document.querySelector("#menuBtn");
    const links = document.querySelectorAll("#catalogue a");

    // 點擊漢堡按鈕時顯示或隱藏菜單
    menuBtn.addEventListener("click", function () {
        catalogue.classList.toggle("show");
    });

    // 點擊菜單中的鏈接時，隱藏菜單
    links.forEach(link => {
        link.addEventListener("click", function () {
            catalogue.classList.remove("show");
        });
    });
    document.getElementById('api-doc').addEventListener("click", () => catalogue.classList.remove("show"));
}

function loadPage(apiData) {
        const fragment = document.createDocumentFragment(); // 創建一個 DocumentFragment 用來放 API 文檔
        const navFragment = document.createDocumentFragment(); // 用來生成目錄的 fragment



        let currentCategoryId = null;  // 跟踪當前的 category
        let categoryContainer = null;  // 當前 category 的 div 容器
        let apiCounter = 1;  // 用來生成 API 的唯一 ID
        let categoryCounter = 1; // 用來生成 category 的編號
        let apiSubCounter = 1; // 用來生成 API 的子編號

        apiData.forEach(item => {
            const categoryId = item.category;  // 根據 category 進行分組
            const categoryName = categoryNames[categoryId];

            // 當遇到新 category 時，創建新的 <h2> 和 <div> 容器
            if (currentCategoryId !== categoryId) {
                currentCategoryId = categoryId;
                apiSubCounter = 1; // 重置子編號

                // 創建一個新的 <div> 容器
                categoryContainer = document.createElement('div');

                // 創建 <h2> 標題並添加到容器中，顯示編號
                const h2 = document.createElement('h2');
                h2.textContent = `${categoryCounter}. ${categoryName}`;
                h2.classList.add('category-title');  // 添加 class 區分樣式
                categoryContainer.appendChild(h2);

                // 將新的 category 容器添加到 fragment 中
                fragment.appendChild(categoryContainer);

                // 在目錄中添加這個 category，帶編號
                const navCategoryItem = document.createElement('li');
                const categoryHeader = document.createElement('h2');
                categoryHeader.textContent = `${categoryCounter}. ${categoryName}`;
                categoryHeader.classList.add('category-title');  // 添加 class
                navCategoryItem.appendChild(categoryHeader);
                navFragment.appendChild(navCategoryItem);

                categoryCounter++; // 類別編號自增
            }

            // 創建一個 API 文檔的 div，並插入對應的數據，帶子編號
            const apiDocDiv = document.createElement('div');
            const apiId = `api-${apiCounter}`; // 生成唯一的 id
            apiDocDiv.setAttribute('id', apiId); // 為 API div 添加 id
            apiDocDiv.setAttribute('class', 'api-block');

            apiDocDiv.innerHTML = `
                <h3 class="api-title">${categoryCounter - 1}.${apiSubCounter} ${item.api_name}</h3>
                <p>${item.description}</p>
                <p><strong>Method: </strong><span>${item.method}</span></p>
                <p><strong>Route: </strong><span>${item.route}</span></p>
                <p><strong>Requires Header Token: </strong><span>${item.requires_token}</span></p>
                <p><strong>Route Parameters: </strong><span>${item.route_parameters}</span></p>
                <p><strong>Post Body Parameters: </strong></p>
                <pre>${item.post_body}</pre>
                <h4>Example</h4>
                <p>Post Body Format:</p>
                <pre>${item.post_example}</pre>
                <p>Response:</p>
                <pre>${item.response_example}</pre>
            `;

            // 將 API 文檔的 div 添加到當前 category 的容器中
            categoryContainer.appendChild(apiDocDiv);

            // 創建對應的目錄條目，並設置連接到 API 的跳轉，帶子編號
            const navItem = document.createElement('li');
            const navLink = document.createElement('a');
            navLink.setAttribute('href', `#${apiId}`);
            navLink.textContent = `${categoryCounter - 1}.${apiSubCounter} ${item.api_name}`;
            navLink.classList.add('api-link');  // 添加 class 區分樣式
            navItem.appendChild(navLink);
            navFragment.appendChild(navItem);

            apiSubCounter++; // 子編號自增
            apiCounter++; // 全局 API 計數器自增
        });

        const copyRight = document.createElement('p');
        copyRight.innerHTML = '&#169; Pixel Weather<br>Hiufung Leung - Yikiniku';
        copyRight.style.textAlign = 'center';
        fragment.appendChild(copyRight);
        // 最後將 API 文檔的 fragment 中的所有內容一次性添加到 DOM 中
        document.getElementById('api-doc').appendChild(fragment);

        // 將目錄添加到 <div id='catalogue'>
        const navContainer = document.getElementById('catalogue');
        const navList = document.querySelector('#catalogue ul');
        navList.appendChild(navFragment);
        navContainer.appendChild(navList);
}

function listenToColorScheme() {
    // 使用 matchMedia 監聽 prefers-color-scheme 媒體查詢
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const catalogue = document.getElementById('catalogue');
    const erd = document.getElementById('erd');
    const darkBackgroundColor = 'black';
    const darkFontColor = 'white';

    // 根據系統的深色模式設置相應樣式
    function applyColorScheme(event) {
        if (event.matches) {
            // 如果是深色模式
            document.body.style.backgroundColor = darkBackgroundColor;
            document.body.style.color = darkFontColor;
            document.querySelectorAll('pre').forEach(item => { item.style.backgroundColor = '#202020'; });
            document.querySelectorAll('.api-link').forEach(item => { item.style.color = darkFontColor; });
            erd.setAttribute('src', 'db_structure_dark.svg');
            catalogue.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // 直接設置背景顏色
        } else {
            // 如果是淺色模式
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
            document.querySelectorAll('pre').forEach(item => { item.style.backgroundColor = '#f5f5f5'; });
            document.querySelectorAll('.api-link').forEach(item => { item.style.color = '#444'; });
            erd.setAttribute('src', 'db_structure.svg');
            catalogue.style.backgroundColor = 'rgba(255,255,255, 0.95)'; // 直接設置背景顏色
        }
    }

    // 初次加載時應用顏色模式
    applyColorScheme(mediaQuery);

    // 當系統顏色模式發生改變時，自動更新樣式
    mediaQuery.addEventListener('change', applyColorScheme); // 使用 addEventListener 替代已棄用的 addListener
}