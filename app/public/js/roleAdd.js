$(function(){

    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');

    $('.tree li.parent_li > span').on('click', function (e) {

        var children = $(this).parent('li.parent_li').find(' > ul > li');

        if (children.is(":visible")) {

            children.hide('fast');

            $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');

        } else {

            children.show('fast');

            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');

        }

        e.stopPropagation();

    });


    $(".tree_node_parent_checkbox").click(function(){  
    var isChange = $(this).prop("checked");  
    if(isChange){
        $(this).next().find(".tree_node_child_checkbox").prop("checked", true);  
    }else{  
        $(this).next().find(".tree_node_child_checkbox").removeAttr("checked");  
    }  



    $(".tree_node_child_checkbox").click(function () {  
     var length = $(this).parent().find(".tree_node_child_checkbox:checked").length;  
     if($(this).prop("checked")){  
         if(length == 1){  
             $(this).parent().prev().prop("checked", true);  
         }  
     }else{ 
         if(length == 0){   
             $(this).parent().prev().removeAttr("checked");  
         }  
     }  
 });  
});  



});








