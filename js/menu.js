var button = $(".b-menu .min_menu span"),
	menu = $(".b-menu .min_menu .menu");

menu.html($(".b-menu .big_menu").html());

function ShowMinMenu(){
	menu.show();
	button.addClass("active");
	button.unbind();
	button.click(HideMinMenu);
	$(".b-content").click(HideMinMenu);

}

function HideMinMenu(){
	menu.hide();
	button.removeClass("active");
	button.unbind();
	button.click(ShowMinMenu);
	$(".b-content").unbind();
}

HideMinMenu();

$(".b-menu .min_menu .menu a").click(HideMinMenu);