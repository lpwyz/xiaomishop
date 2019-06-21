$(function(){
	app.init();
});
var app= {
	init: function() {
		this.toggleAside();
		this.deleteConfirm();
	},
	deleteConfirm: function() {
		$('.delete')
			.click(function() {
				var flag = confirm('您确定要删除吗?');
				return flag;
			})
	},
	toggleAside: function() {
		$('.aside h4')
			.click(function() {
				$(this)
					.siblings('ul')
					.slideToggle();
			})
	},
	/* 公共的修改属性状态*/
	changeStatus: function(el, model, attr, id) {
		$.get('/admin/changeStatus', { model: model, attr: attr, id: id }, function(data) {
			if (data.success) {
				if (el.src.indexOf('yes') != -1) {
					el.src = '/public/admin/images/no.gif';
				} else {
					el.src = '/public/admin/images/yes.gif';
				}
			}
		})
	},
	/* 公共的修改属性的数量以及顺序等等*/
	editNum:function(el,model,attr,id){
		var val=$(el).html();
		var input=$("<input value='' />");
		//把input放在sapn里面
		$(el).html(input);
		//让input获取焦点  给input赋值
		$(input).trigger('focus').val(val);
		//点击input的时候阻止冒泡
		$(input).click(function(){
			return false;
		});
		//鼠标离开的时候给span赋值
		$(input).blur(function(){
			var num=$(this).val();
			$(el).html(num);
			// console.log(model,attr,id)
			$.get('/admin/editNum',{model:model,attr:attr,id:id,num:num},function(data) {
				console.log(data);
			})
		})
	},
	resizeIframe:function(){
		var heights = document.documentElement.clientHeight-100;
		document.getElementById('rightMain').height = heights
	},
	/* 验证用户输入的密码*/
	chechPwd:function(el,model,attr,id) {
        num=$(el).val();
		$.get('/admin/chechPwd',{model:model,attr:attr,id:id,num:num},function(data) {
			 if (data.success){
			 }
			 else {
			 	alert('密码错误，请重新输入');
			 }
		})
	}
};

