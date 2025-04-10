//button status
const buttonsStatus = document.querySelectorAll("[button-status]")
if(buttonsStatus.length >0){
    let url = new URL(window.location.href);
    // console.log(url)
    buttonsStatus.forEach(button =>{
        button.addEventListener("click",()=>{
            const status = button.getAttribute("button-status")
            if(status){
                url.searchParams.set("status",status);
            }else{
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault();
        const keyword= e.target.elements.keyword.value;


        if(keyword){
            url.searchParams.set("keyword",keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href;
    })
    
}
//end form search

//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click",()=>{
            const page= button.getAttribute("button-pagination");
            // console.log(page)
            url.searchParams.set("page",page);
            window.location.href=url.href
        })
    })
}
//end Pagination


//Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll= checkboxMulti.querySelector("input[name ='checkall']")
    const inputsID=checkboxMulti.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener("click",()=>{
        if(inputCheckAll.checked){
           inputsID.forEach(input=>{
            input.checked=true;
           })
        }else{
            inputsID.forEach(input=>{
                input.checked=false;
               })
        }
    })
    inputsID.forEach(input=>{
        input.addEventListener("click",()=>{
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length
            if(countChecked==inputsID.length){
                inputCheckAll.checked=true
            }else{
                inputCheckAll.checked=false
            }
        })
    })

}
//end checkbox

//form Change Multi
const formChangeMulti= document.querySelector("[form-change-multi]")
if(formChangeMulti){
 formChangeMulti.addEventListener("submit",(e)=>{
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
    )

    const typeChange = e.target.elements.type.value
    if(typeChange=="delete-all"){
        const isConfirm = confirm("bạn có chắc muốn xóa những sản phẩm này")
        if(!isConfirm){
            return;
        }
    }


    if(inputChecked.length > 0){
        let ids=[]
        const inputIds= formChangeMulti.querySelector("input[name='ids']")
        inputChecked.forEach(input=>{
            const id=input.value;
            if(typeChange=="change-position"){
                const position = input.closest("tr").querySelector("input[name='position']").value
                ids.push(`${id}-${position}`)
            }else{
                ids.push(id);
            }
            
        })
        inputIds.value=ids.join(", ")
        formChangeMulti.submit();
    }else{
        alert('Vui lòng chọn ít nhất 1 bản ghi');
    } 
 })
}
//end form change


//show alert
const showAlert=document.querySelector("[show-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    },time)
    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden")
    })
}
//end show alert

//Upload Image
const uploadImageInput = document.querySelector("[upload-image-input]");
const uploadImagePreviewContainer = document.querySelector(".image-preview-container");
// const uploadImage = document.querySelector("[upload-image]")
if(uploadImageInput){
    uploadImageInput.addEventListener("change",(e)=>{
        uploadImagePreviewContainer.innerHTML = '';
        const files = e.target.files;
        Array.from(files).forEach(file => {
            if (file) {
                const img = document.createElement('img'); // Tạo thẻ img cho mỗi ảnh
                img.src = URL.createObjectURL(file); // Tạo URL cho ảnh
                img.className = 'image-preview'; // Thêm class cho ảnh
                img.style.display = 'block'; // Hiện ảnh
                uploadImagePreviewContainer.appendChild(img); // Thêm ảnh vào container
            }
        });
        
    })
}
//end Upload Image


//sort
const sort = document.querySelector("[sort]");
if(sort){
    let url = new URL(window.location.href)
    const sortSelect=sort.querySelector("[sort-select]")
    const sortClear=sort.querySelector("[sort-clear]")
    //sắp xếp
    sortSelect.addEventListener("change",(e)=>{
        const value = e.target.value
        const[sortKey,sortValue] = value.split("-")

        url.searchParams.set("sortKey",sortKey)
        url.searchParams.set("sortValue",sortValue)
        window.location.href=url.href
    })
    //Xóa sắp xếp
    sortClear.addEventListener("click",()=>{
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")
        window.location.href=url.href
    })
    const sortKey =   url.searchParams.get("sortKey")
    const sortValue =   url.searchParams.get("sortValue")
    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`
        console.log(stringSort)
        const optionSelected=sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected=true
    }

}
//end sort

