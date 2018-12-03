let arrTabContent = []
let arrSideNavIcon = [];
let arrTabID = [];

let arrCurrentTabID = [];
let currentIndex = 0;

$(() => {

    let user = JSON.parse(sessionStorage.getItem('authenticatedUser'))[0];
    setResourceCanBeShown(user);
    renderPageContent();
    renderSideNav();
    setTimeout(() => {
        initPageEvents();
    }, 1000);
    
})

function addClassActiveNavLink(e){
    e.preventDefault();
    let href = $(this).attr('href');
    if (arrTabID.indexOf(href) > -1) {
        $('a').removeClass('active-tab');
        $(`a[href="${href}"]`).addClass('active-tab');
    }
}

function removeTab(e){
    e.stopPropagation();
    let href = $(this).parents('a.nav-link').attr('href');
    let index = arrCurrentTabID.findIndex(item => item == href);
    let index2 = arrTabID.findIndex(item => item == href);
    if(currentIndex == index2) {
        currentIndex = -1;
        $('a[href="#empty-page"]').eq(0).tab('show');
        $('body a').removeClass('active-tab');
    }
    arrCurrentTabID.splice(index, 1);
    renderNavLinks();
}

function renderNavLinks(){
    let $ele = $('ul.nav.nav-tabs');
    $ele.html('');
    arrCurrentTabID.forEach(item => {
        let index = arrTabID.indexOf(item);
        $ele.append(`
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="${item}" role="tab" style="color: black">
                    ${arrTabContent[index]}
                    <i class="fa fa-times remove-tab float-right"></i>
                </a>
            </li>`);
        if(currentIndex != -1 && item == arrTabID[currentIndex]){
            $ele.find('li').last().find('a.nav-link').addClass('active-tab');
        }
        $ele.find('li').last().find('a.nav-link').click(function(e){
            currentIndex = index;
            addClassActiveNavLink.call(this, e);
        });
        $ele.find('li').last().find('i.remove-tab').click(removeTab);
    })
    $ele.append(`
        <li class="nav-item" style="display: none">
            <a class="nav-link" data-toggle="tab" href="#empty-page" role="tab" style="color: black"></a>
        </li>`);
}

function renderSideNav(){
    $('.side-nav ul').html('');
    arrTabID.forEach((item, index) => {
        $('.side-nav ul').append(`
        <li class="list-group-item">
            <a class="nav-link" data-toggle="tab" role="tab" href="${item}">
                <i class="fa fa-${arrSideNavIcon[index]}"></i> ${arrTabContent[index]}
            </a>
        </li>`);
    })
}

// [{
//     "iUserID": 1,
//     "sUsername": "admin",
//     "sFullName": "Vu Hoang",
//     "bPage1": 1,
//     "bPage2": 1,
//     "bPage3": 1,
//     "bPage4": 1,
//     "bAdmin": 1
//   }]

function renderPageContent(){
    // tab-page-content
    $('#tab-page-content').html('');
    arrTabID.forEach((item, index) => {
        item = item.substring(1, item.length - 5);
        $('#tab-page-content').append(`
        <div class="tab-pane fade" id="${item}-page" role="tabpanel">
            <iframe src="${item}.html" width="100%"></iframe>
        </div>`);
    });
    $('#tab-page-content').append(`
    <div class="tab-pane fade" id="empty-page" role="tabpanel">
                                
    </div>`);
}

function initPageEvents(){
    $('body a').click(function(e) {
        window.addClassActiveNavLink.call(this, e);
        window.showTab.call(this);
    });
   
    $('.side-nav a').click(function (e) {
        let href = $(this).attr('href');
        currentIndex = arrTabID.findIndex(item => item == href);
        let index = arrCurrentTabID.findIndex(item => item == href);
        if(index > -1) return;
        arrCurrentTabID.push(href);
        renderNavLinks();
    })

    $('i.fa.remove-tab').click(removeTab);

    $(`a[href="${arrTabID[0]}"]`).addClass('active-tab');

    renderNavLinks();
}

function showTab(){
    let hash = $(this).attr('href');
    if($(hash) == null || $(hash) == undefined) return;
    $(this).tab('show');
}

function setResourceCanBeShown(user){
    let { bPage1, bPage2, bPage3, bPage4, bPage5, bPage6, bAdmin } = user;
    if(bAdmin == 1){
        arrTabContent = [
            "Danh sách nhân viên",
            "Danh sách tức thời",
            "Chấm công nhân viên",
            "Báo cáo tức thời",
            "Danh sách xe",
            "Danh sách xe tức thời",
            "Quản lý người dùng",
        ];
        
        arrTabID = [
            "#danh-sach-nhan-vien-page",
            "#danh-sach-tuc-thoi-page",
            "#cham-cong-nhan-vien-page",
            "#bao-cao-tuc-thoi-page",
            "#danh-sach-xe-page",
            "#danh-sach-xe-tuc-thoi-page",
            "#user-management-page",
        ];
        arrSideNavIcon = ['users', 'list', 'calendar', 'star', 'car', 'taxi', 'user-plus'];
    }else {
        arrTabContent = [];
        arrTabID = [];
        arrSideNavIcon = [];

        if(bPage1 == 1){
            arrTabContent.push("Danh sách nhân viên");
            arrTabID.push("#danh-sach-nhan-vien-page");
            arrSideNavIcon.push('users');
        }
        if(bPage2 == 1){
            arrTabContent.push("Danh sách tức thời");
            arrTabID.push("#danh-sach-tuc-thoi-page");
            arrSideNavIcon.push('list');
        }
        if(bPage3 == 1){
            arrTabContent.push("Chấm công nhân viên");
            arrTabID.push("#cham-cong-nhan-vien-page");
            arrSideNavIcon.push('calendar');
        }
        if(bPage4 == 1){
            arrTabContent.push("Báo cáo tức thời");
            arrTabID.push("#bao-cao-tuc-thoi-page");
            arrSideNavIcon.push('star');
        }
        if(bPage5 == 1){
            arrTabContent.push("Danh sách xe");
            arrTabID.push("#danh-sach-xe-page");
            arrSideNavIcon.push('car');
        }
        if(bPage6 == 1){
            arrTabContent.push("Danh sách xe tức thời");
            arrTabID.push("#danh-sach-xe-tuc-thoi-page");
            arrSideNavIcon.push('taxi');
        }
    }
}
