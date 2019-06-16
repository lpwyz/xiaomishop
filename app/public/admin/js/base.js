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
	}
};
