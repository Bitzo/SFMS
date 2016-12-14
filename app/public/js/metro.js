var setting = {
			async: {
				enable: true,
				url:"/func?access_token=" + localStorage.getItem('jit_token') + "&jitkey=" + localStorage.getItem('jit_key'),
				//otherParam:{"otherParam":"zTreeAsyncTest"},
				dataFilter: filter,
                datatype:'json',
                type:'get'
			},
            callback: {
		       onClick: zTreeOnClick
	        }
		};
		function filter(treeId, parentNode, childNodes) {
			if (!childNodes) return null;
			for (var i=0, l=childNodes.length; i<l; i++) {
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
			}
            console.log(childNodes.data);
			return childNodes.data;

		}

        function zTreeOnClick(event, treeId, treeNode) {
            alert(treeNode.tId + ", " + treeNode.name);
        };

		$(document).ready(function(){
			$.fn.zTree.init($("#treeDemo"), setting);
		});