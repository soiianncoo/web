//Permissons
const tablePermissons= document.querySelector("[table-permissions]")
if(tablePermissons){
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click",()=>{
        let permissions = []
        const rows = tablePermissons.querySelectorAll("[data-name]")
        rows.forEach(row=>{
            const name = row.getAttribute("data-name")
            const inputs = row.querySelectorAll("input")
            if(name == "id"){
                inputs.forEach(input=>{
                    const id = input.value
                    permissions.push({
                        id:id,
                        permissions:[]
                    })
                })
            }else{
                inputs.forEach((input,index)=>{
                    const checked=input.checked;
                    if(checked){
                        permissions[index].permissions.push(name)
                    }
                })
            }
        });
        if(permissions.length >0){
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions=formChangePermissions.querySelector("input[name='permissions']")
            inputPermissions.value = JSON.stringify(permissions)
            formChangePermissions.submit();

        }
    })
}
//end Permissons

//Permissions Data default
const dataRecords = document.querySelector("[data-records]")
if(dataRecords){
    const records=JSON.parse(dataRecords.getAttribute("data-records"))
    const tablePermissons= document.querySelector("[table-permissions]")
    records.forEach((record,index)=>{
        const permissions = record.permissions;

        permissions.forEach(permission=>{
            const row=tablePermissons.querySelector(`[data-name=${permission}]`)
            const input=row.querySelectorAll("input")[index]
            input.checked=true
        })
    })
}

//End permissions data default