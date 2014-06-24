var php_url = "php/";
var MAX_ITEM_PER_PAGE = 10;
var videos = new Object();
var pageInfo = {
    movie : {},
    collection : {},
    tvseries : {},
    maxMenuItem : 8
}
$('#movie-table-div').show().siblings().hide();

$(".wait-block").show();
getRecords("storage", true);
getRecords("group", true);
getRecords("resolution", true);
getVideos("movie", true);
getVideos("collection", true);
getVideos("tvseries", true);
var loaded_blocks = 0;

function getRecords(type, loading) {
    if(loading == undefined)
        loading = false;

    var table_name = type == "group"?"encodegroup":type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    for(var i = table.rows.length - 1; i >= 2; i--)
        table.deleteRow(i);
    if(!loading)
        $(".wait-block").show();
    $.ajax({
        type: "GET",
        url: php_url + "GetRecords.php",
        data: {
            table: table_name
        },
        dataType: "json",
        success: function(data){
            $.each(data, function(index, item) {
                var newRow = $("#" + table_id)[0].insertRow(-1);
                var id = document.createElement("td");
                var name = document.createElement("td");
                var op = document.createElement("td");
                id.innerHTML = item["id"];
                name.innerHTML = item["name"];
                op.innerHTML = '<a onclick="editRecord(\'' + type + '\',' + item["id"] + ')">编辑</a>';
                op.innerHTML += " | ";
                op.innerHTML += '<a onclick="delRecord(\'' + type + '\',' + item["id"] + ')">删除</a>';

                newRow.appendChild(id);
                newRow.appendChild(name);
                newRow.appendChild(op);
            });

            $("select").each(function() {
                if($(this)[0].id.indexOf(type) == -1)
                    return;
                var select =  $(this)[0];
                for(var i=0; i < select.options.length;)
                    select.removeChild(select.options[i]);
                select.appendChild(document.createElement("option"));
                $.each(data, function(index, item) {
                    var option = document.createElement("option");
                    option.innerHTML = item["name"];
                    select.appendChild(option);
                });
            })
            if(!loading) {
                $(".wait-block").hide();
            } else {
                loaded_blocks++;
                if(loaded_blocks >= 6)
                    $(".wait-block").hide();
            }
        }
    });
}

function getRowById(table, id) {
    var row;
    for(var i = 2; i < table.rows.length;i++) {
        row = table.rows[i];
        if(row.cells[0].innerHTML == '' + id)
            return row;
    }
}

function editRecord(type, id) {
    var table_name = type == "group"?"encodegroup":type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = getRowById(table, id);

    var values = new Array();
    for(var i = 1; i < row.cells.length - 1; i++)
        values.push(row.cells[i].innerHTML);

    row.cells[1].innerHTML = '<input class="form-control" type="text" value="' + values[0] + '" />'
    row.cells[2].innerHTML = '<a onclick="updateRecord(\'' + type + '\',' + id +')">保存</a>';
    row.cells[2].innerHTML += " | ";
    row.cells[2].innerHTML += '<a onclick="getRecords(\'' + type + '\')">取消</a>';
}

function delRecord(type,id) {
    var table_name = type == "group"?"encodegroup":type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = getRowById(table, id);
    var yes = confirm("确实要删除 " + row.cells[1].innerHTML + " 吗？");
    if(yes == false)
        return;

    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "GET",
        url: php_url + "DeleteRow.php",
        data: {
            id: id,
            table: table_name
        },
        async:false
    });
    $(".wait-block").hide();
    var result = htmlobj.responseText;
    if(result == "success") {
        fixed_top_success("删除成功！");
        getRecords(type);
    } else {
        fixed_top_error(result);
    }
}

function updateRecord(type, id) {
    var table_name = type == "group"?"encodegroup":type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = getRowById(table, id);

    var input_content = row.cells[1].firstChild.value;
    if(input_content == "") {
        fixed_top_warning("请输入名字");
        return;
    }
    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "POST",
        url: php_url + "UpdateRecord.php",
        data: {
            id: id,
            name: input_content,
            table: table_name
        },
        async:false
    });
    $(".wait-block").hide();
    var result = htmlobj.responseText;
    if(result == "success") {
        fixed_top_success("修改成功！");
        getRecords(type);
    } else {
        fixed_top_error(result);
    }
}

function submitNewRecord(type) {
    var name_id = "new-" + type + "-name";
    var note_id = "new-" + type + "-note";
    var button_id = "new-" + type + "-submit";
    var table_name = type == "group"?"encodegroup":type;
    if($("#" + name_id).val() == "") {
        fixed_top_warning("请输入名字");
        return;
    }
    $("#" + button_id).attr("disabled", true);
    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "POST",
        url: php_url + "SubmitNewRecord.php",
        data: {
            name: $("#" + name_id).val(),
            note: $("#" + note_id).val(),
            table: table_name
        },
        async:false
    });
    var result = htmlobj.responseText;
    $("#" + button_id).attr("disabled", false);
    $(".wait-block").hide();
    if(result == "success") {
        fixed_top_success("添加成功！");
        $('.float-block').hide();
        $("#" + name_id).val("");
        $("#" + note_id).val("");
        getRecords(type);
    } else {
        fixed_top_error(result);
    }
}

function filterRecord(type) {
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];

    for(var i = 2; i < table.rows.length; i++) {
        var row = table.rows[i];
        var visible = true;
        for(var j = 0; j < row.cells.length -1 ; j++) {
            if(row.cells[j].innerHTML.indexOf(table.rows[1].cells[j].firstChild.value) == -1) {
                visible = false;
                break;
            }
        }
        if(visible == true)
            row.style.display = "table-row";
        else
            row.style.display = "none";
    }
}

function findRecordId(type, name) {
    if(name == "")
        return "";
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];

    for(var i = 2; i < table.rows.length; i++) {
        var row = table.rows[i];
        if(row.cells[1].innerHTML == name)
            return row.cells[0].innerHTML;
    }
    return "";
}

function submitNewVideo(type) {
    var english_name,chinese_name,resolution,encodegroup,
        storage,count = null,season = null;

    var english_name_input = $("#new-" + type + "-english-name");
    var chinese_name_input = $("#new-" + type + "-chinese-name");
    var encodegroup_input = $("#new-" + type + "-group");
    var resolution_input = $("#new-" + type + "-resolution");
    var storage_input = $("#new-" + type + "-storage");
    var count_input = $("#new-" + type + "-count");
    var season_input = $("#new-" + type + "-season");

    english_name = english_name_input.val();
    chinese_name = chinese_name_input.val();
    encodegroup = findRecordId("group", encodegroup_input.val());
    resolution = findRecordId("resolution", resolution_input.val());
    storage = findRecordId("storage", storage_input.val());
    if(type == "collection")
        count = count_input.val();
    if(type == "tvseries")
        season = season_input.val();
    var table_name = type;

    if(checkVideo(type, english_name, chinese_name,
        encodegroup, resolution, storage, count, season) == false)
        return;

    var button_id = "new-" + type + "-submit";
    $("#" + button_id).attr("disabled", true);
    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "POST",
        url: php_url + "SubmitNewVideo.php",
        data: {
            english: english_name,
            chinese: chinese_name,
            encodegroup: encodegroup,
            resolution: resolution,
            storage: storage,
            count: count,
            season: season,
            table: table_name
        },
        async:false
    });
    var result = htmlobj.responseText;
    $("#" + button_id).attr("disabled", false);
    $(".wait-block").hide();
    if(result == "success") {
        fixed_top_success("添加成功！");
        $('.float-block').hide();
        getVideos(type);
        chinese_name_input.val("");
        english_name_input.val("");
        storage_input[0].firstChild.selected = "true";
        resolution_input[0].firstChild.selected = "true";
        encodegroup_input[0].firstChild.selected = "true";
        if(type == "collection")
            count_input.val("");
        if(type == "tvseries")
            season_input.val("");
    } else {
        fixed_top_error(result);
    }
}

function getVideos(type, loading) {
    if(loading == undefined)
        loading = false;
    var table_name = type
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    for(var i = table.rows.length - 1; i >= 2; i--)
        table.deleteRow(i);

    if(!loading)
        $(".wait-block").show();
    $.ajax({
        type: "GET",
        url: php_url + "GetVideos.php",
        data: {
            table: table_name
        },
        dataType: "json",
        success: function(data){
            videos[type] = data;
            var rowID = 2;
            $.each(data, function(index, item) {
                var newRow = $("#" + table_id)[0].insertRow(-1);
                var id = document.createElement("td");
                var chinese = document.createElement("td");
                var english = document.createElement("td");
                var storage = document.createElement("td");
                var resolution = document.createElement("td");
                var encodegroup = document.createElement("td");
                var count = document.createElement("td");
                var season = document.createElement("td");
                var addtime = document.createElement("td");
                var op = document.createElement("td");
                id.innerHTML = item["id"];
                chinese.innerHTML = item["chinese"];
                english.innerHTML = item["english"];
                storage.innerHTML = item["storage"];
                resolution.innerHTML = item["resolution"];
                encodegroup.innerHTML = item["encodegroup"];
                season.innerHTML = item["season"];
                count.innerHTML = item["count"];
                addtime.innerHTML = item["addtime"];
                op.innerHTML = '<a onclick="editVideo(\'' + type + '\',' + rowID + ')">编辑</a>';
                op.innerHTML += " | ";
                op.innerHTML += '<a onclick="delVideo(\'' + type + '\',' + rowID + ')">删除</a>';

                id.style.display = "none";
                newRow.appendChild(id);
                newRow.appendChild(chinese);
                newRow.appendChild(english);
                if(type == "collection")
                    newRow.appendChild(count);
                else if(type == "tvseries")
                    newRow.appendChild(season);
                newRow.appendChild(resolution);
                newRow.appendChild(encodegroup);
                newRow.appendChild(storage);
                newRow.appendChild(addtime);
                newRow.appendChild(op);
                rowID++;
                newRow.deleted = false;
                newRow.filtered = true;
            });
            setVideoMenu(type);
            if(!loading){
                $(".wait-block").hide();
            } else {
                loaded_blocks++;
                if(loaded_blocks >= 6)
                    $(".wait-block").hide();
            }
        }
    });
}

function delVideo(type, rowID) {
    var table_name = type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = table.rows[rowID];
    var yes = confirm("确实要删除 " + row.cells[1].innerHTML + " 吗？");
    if(yes == false)
        return;
    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "GET",
        url: php_url + "DeleteRow.php",
        data: {
            id: row.cells[0].innerHTML,
            table: table_name
        },
        async:false
    });
    $(".wait-block").hide();
    var result = htmlobj.responseText;
    if(result == "success") {
        fixed_top_success("删除成功！");
        row.style.display = "none";
        row.deleted = true;
        var pageID = pageInfo[type].currentPage;
        setVideoMenu(type);
        changeVideoPage(type, pageID);
    } else {
        fixed_top_error(result);
    }
}

function filterVideo(type) {
    var table_id = type + "-table";
    var table = $("#" + table_id)[0];
    for(var i = 2; i < table.rows.length; i++) {
        var row = table.rows[i];
        var visible = true;
        for(var j = 1; j < row.cells.length -1 ; j++) {
            var selector = "#" + table_id + " tr:eq(1) td:eq(" + j +")";
            if(row.cells[j].innerHTML.indexOf($(selector).children(0).val()) == -1) {
                visible = false;
                break;
            }
        }
        if(visible == true)
            row.filtered = true;
        else
            row.filtered = false;
    }
    setVideoMenu(type);
}

function selectOption(select, option) {
    for(var i = 0; i < select.options.length; i++) {
        if(select.options[i].innerHTML == option)
            select.options[i].selected = "true";
    }
}

function editVideo(type, rowID) {
    var table_name = type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = table.rows[rowID];

    var values = new Array();
    for(var i = 1; i < row.cells.length - 1; i++)
        values.push(row.cells[i].innerHTML);

    var index = 1;
    //中文名
    row.cells[index].innerHTML = '<input class="form-control" type="text" value="' + values[index - 1] + '" />';
    index++;
    //英文名
    row.cells[index].innerHTML = '<input class="form-control" type="text" value="' + values[index - 1] + '" />';
    index++;
    if(type != "movie") {
        //部数或者季数
        row.cells[index].innerHTML = '<input class="form-control" type="text" value="' + values[index - 1] + '" />';
        index++;
    }
    //规格小组存储
    for(var i = 0; i < 3; i++, index++) {
        row.cells[index].innerHTML = '<select class="form-control"></select>';
        row.cells[index].getElementsByTagName("select")[0].innerHTML = table.rows[1].cells[index].getElementsByTagName("select")[0].innerHTML;
        selectOption(row.cells[index].getElementsByTagName("select")[0], values[index - 1]);
    }
    //跳过添加时间
    index++;
    row.cells[index].innerHTML = '<a onclick="updateVideo(\'' + type + '\',' + rowID +')">保存</a>';
    row.cells[index].innerHTML += " | ";
    row.cells[index].innerHTML += '<a onclick="cancelVideo(\'' + type + '\',' + rowID + ')">取消</a>';
}

function setVideoRowData(type, row, rowID) {
    var index = 1;
    var videoID = rowID - 2;
    row.cells[index++].innerHTML = videos[type][videoID]["chinese"];
    row.cells[index++].innerHTML = videos[type][videoID]["english"];
    if(type == "collection")
        row.cells[index++].innerHTML = videos[type][videoID]["count"];
    if(type == "tvseries")
        row.cells[index++].innerHTML = videos[type][videoID]["season"];
    row.cells[index++].innerHTML = videos[type][videoID]["resolution"]
    row.cells[index++].innerHTML = videos[type][videoID]["encodegroup"]
    row.cells[index++].innerHTML = videos[type][videoID]["storage"]
    index++;
    row.cells[index].innerHTML = '<a onclick="editVideo(\'' + type + '\',' + rowID + ')">编辑</a>';
    row.cells[index].innerHTML += " | ";
    row.cells[index].innerHTML += '<a onclick="delVideo(\'' + type + '\',' + rowID + ')">删除</a>';
}

function cancelVideo(type, rowID) {
    var table_name = type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = table.rows[rowID];
    setVideoRowData(type, row, rowID);
}

function updateVideo(type, rowID) {
    var table_name = type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var row = table.rows[rowID];

    var id, english_name,chinese_name,resolution,encodegroup,
        storage,count = null,season = null;

    var index = 0;
    id = row.cells[index++].innerHTML;
    chinese_name = row.cells[index++].getElementsByTagName("input")[0].value;
    english_name = row.cells[index++].getElementsByTagName("input")[0].value;
    if(type == "collection")
        count = row.cells[index++].getElementsByTagName("input")[0].value;
    if(type == "tvseries")
        season = row.cells[index++].getElementsByTagName("input")[0].value;
    var resolution_origin = row.cells[index++].getElementsByTagName("select")[0].value;
    var encodegroup_origin = row.cells[index++].getElementsByTagName("select")[0].value;
    var storage_origin = row.cells[index++].getElementsByTagName("select")[0].value;
    resolution = findRecordId("resolution", resolution_origin);
    encodegroup = findRecordId("group", encodegroup_origin);
    storage = findRecordId("storage", storage_origin);

    if(checkVideo(type, english_name, chinese_name,
        encodegroup, resolution, storage, count, season) == false)
        return;

    $(".wait-block").show();
    var htmlobj = $.ajax({
        type: "POST",
        url: php_url + "UpdateVideo.php",
        data: {
            id: id,
            english: english_name,
            chinese: chinese_name,
            encodegroup: encodegroup,
            resolution: resolution,
            storage: storage,
            count: count,
            season: season,
            table: table_name
        },
        async:false
    });
    $(".wait-block").hide();
    var result = htmlobj.responseText;
    if(result == "success") {
        fixed_top_success("修改成功！");
        var videoID = rowID - 2;
        videos[type][videoID]["chinese"] = chinese_name;
        videos[type][videoID]["english"] = english_name;
        if(type == "collection")
            videos[type][videoID]["count"] = count;
        if(type == "tvseries")
            videos[type][videoID]["season"] = season;
        videos[type][videoID]["resolution"] = resolution_origin;
        videos[type][videoID]["encodegroup"] = encodegroup_origin;
        videos[type][videoID]["storage"] = storage_origin;
        setVideoRowData(type, row, rowID);
    } else {
        fixed_top_error(result);
    }
}

function checkVideo(type, english_name, chinese_name, encodegroup, resolution, storage, count, season) {
    if(english_name == "") {
        fixed_top_warning("请输入英文名");
        return false;
    }
    if(chinese_name == "") {
        fixed_top_warning("请输入中文名");
        return false;
    }

    if(type == "collection" && count == "") {
        fixed_top_warning("请输入部数");
        return false;
    }

    if(type == "tvseries" && season == "") {
        fixed_top_warning("请输入季数");
        return false;
    }

    if(encodegroup == "") {
        fixed_top_warning("请选择小组");
        return false;
    }

    if(resolution == "") {
        fixed_top_warning("请选择规格");
        return false;
    }

    if(storage == "") {
        fixed_top_warning("请选择存储");
        return false;
    }

    if(type == "collection") {
        var reg = /^\d+$/;
        if(!reg.test(count)) {
            fixed_top_warning("部数必须为数字");
            return false;
        }
    }
    return true;
}

function setVideoMenu(type) {
    var table_name = type;
    var table_id = type + "-table";

    var table = $("#" + table_id)[0];
    var validRows = 0;
    for(var i = 2; i < table.rows.length; i++)
        if(table.rows[i].filtered == true && table.rows[i].deleted == false)
            validRows++;
    var pages = Math.ceil(validRows / MAX_ITEM_PER_PAGE);
    pages = pages == 0 ? 1 : pages;
    pageInfo[type].pageCount = pages;
    pageInfo[type].validRows = validRows;
    $("#" + type + "-total").html(validRows);
    setVideoMenuItem(type, 1);
    changeVideoPage(type, 0);
}

function setVideoMenuItem(type, start) {
    var pages = pageInfo[type].pageCount;
    if(start < 1)
        start = 1;
    else if(start > pages)
        start = pages;
    var end = 0;
    if(pages <= pageInfo.maxMenuItem) {
        //页面数少于目录项数，全部显示
        start = 1;
        end = pages;
    } else {
        if(start + pageInfo.maxMenuItem - 1 <= pages) {
            end = start + pageInfo.maxMenuItem - 1;
        } else {
            end = pages;
            start = pages - pageInfo.maxMenuItem + 1;
        }
    }

    var html = '<li><a onclick="changeVideoPage(\'' +
        type + '\',pageInfo[\'' + type + '\'].currentPage - 1)">&laquo;</a></li>';
    for(var i = start; i <= end; i++)
        html += '<li><a onclick="changeVideoPage(\'' +
            type + '\',' + (i - 1) + ')">' + i + '</a></li>';
    html += '<li><a onclick="changeVideoPage(\'' +
        type + '\',pageInfo[\'' + type + '\'].currentPage + 1)">&raquo;</a></li>';
    $("#" + type + "-menu").html(html);
}

function changeVideoPage(type, pageID) {
    if(pageID < 0)
        pageID = 0;
    else if(pageID >= pageInfo[type].pageCount)
        pageID = pageInfo[type].pageCount - 1;

    var validRowStart = pageID * MAX_ITEM_PER_PAGE;
    var table_id = type + "-table";
    var table = $("#" + table_id)[0];
    var count = 0, validRow = 0;
    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].filtered == true && table.rows[i].deleted == false) {
            if(validRow >= validRowStart && count < MAX_ITEM_PER_PAGE) {
                table.rows[i].style.display = "table-row";
                count++;
                validRow++;
                continue;
            }
            validRow++;
        }
        table.rows[i].style.display = "none";
    }
    pageInfo[type].currentPage = pageID;
    //这是防止validRows为0的情况
    var startID = pageID * MAX_ITEM_PER_PAGE + 1 > pageInfo[type].validRows ?
        pageInfo[type].validRows : pageID * MAX_ITEM_PER_PAGE + 1;
    $("#" + type + "-start").html(startID);
    var endID = (pageID + 1) * MAX_ITEM_PER_PAGE > pageInfo[type].validRows ?
        pageInfo[type].validRows : (pageID + 1) * MAX_ITEM_PER_PAGE;
    $("#" + type + "-end").html(endID);

    var menu = $("#" + type + "-menu");
    var children = menu.children("li");
    var start = children.eq(1).children("a").html();
    var end = children.eq(children.length - 2).children("a").html();
    if(end * 1 <= pageID + 1)
        setVideoMenuItem(type, pageID)
    else if(start * 1 >= pageID + 1)
        setVideoMenuItem(type, pageID - 6);
}
