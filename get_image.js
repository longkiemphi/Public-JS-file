var list_item = $('.tb-img').children

function download(i) {
    console.log("iii", i, list_item.length);
    if (i < list_item.length) {
        setTimeout(() => {
            fetch(list_item[i].children[0].style.backgroundImage.split('"')[1].split('.jpg')[0] + '.jpg', {
                method: 'GET',
                headers: {
                    'Content-Type': '\tapplication/vnd.ms-excel',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
            }).then(
                data => {
                    return data.blob();
                }
            ).then(
                response => {
                    console.log(response.type);
                    const dataType = response.type;
                    const binaryData = [];
                    binaryData.push(response);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
                    downloadLink.setAttribute('download', 'report');
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    downloadLink.remove();
                    setTimeout(download(i + 1), 500)
                }
            )
        }, 500)

    } else return;
}

download(0);