$(function () {
    // onload: Trigger ajax loading event
    $(document).trigger('wpr:onload');
    var ajaxObserver = new MutationObserver(function (mutation) {
        var removedNodes = mutation[0].removedNodes;
        for (var i = 0; i < removedNodes.length; i++) {
            if (removedNodes[i].src) {
                if (removedNodes[i].src.indexOf('LitestandTailLoadPagelet') != -1
                    || removedNodes[i].src.indexOf('GroupEntstreamPagelet') != -1) {
                    continue; // ajax paging
                }
                $(document).trigger('wpr:onload'); // ajax loading
            }
        }
    });
    ajaxObserver.observe($('body')[0], { childList: true });

    // Load options from chrome.storage
    chrome.storage.sync.get({
        liquidDesign: false,
        sidebarDisplay: false,
        topGroupsDisplay: true,
        trendingDisplay: true,
        singleLineTrending: true,
        color: '#365899',
        bgColor: '#ffff00'
    }, function (items) {
        // General
        if (items.liquidDesign) {
            $('html').addClass('liquidDesign');
        }

        // Display
        if (items.sidebarDisplay) {
            $('html').addClass('sidebarDisplay');
        } else {
            $('#pagelet_sidebar').addClass('collapsed');
        }
        if (items.topGroupsDisplay) {
            $('html').addClass('topGroupsDisplay');
        }
        if (items.trendingDisplay) {
            $('html').addClass('trendingDisplay');
        }
        if (items.singleLineTrending) {
            $('html').addClass('singleLineTrending');
        }

        /*
         * Highlight Mentions to Me
         */
        var href = $('#pagelet_bluebar a[href*="profile.php"]').attr('href');
        var match = /profile\.php\?id=(\d+)/.exec(href);
        if (match && match.length == 2) {
            var style = document.createElement('style');
            document.head.appendChild(style);
            var rule = `.profileLink[href*="${match[1]}"] {
                 color: ${items.color} !important;
                 background: ${items.bgColor};
                 }`;
            style.sheet.insertRule(rule, 0);
        }
    });

    /*
     * Fixed Side Navigation in Left Column
     */
    $(window).scroll(function () {
        var windowHeight = $(this).height();
        var barHeight = $('#pagelet_bluebar').height();
        var leftColHeight = $('#leftCol').outerHeight() + barHeight;
        var scrollTop = $(this).scrollTop();

        if (leftColHeight <= windowHeight) {
            $('#leftCol').addClass('fixedTop').css('top', barHeight).removeClass('fixedBottom');
        } else {
            if (leftColHeight - windowHeight <= scrollTop) {
                $('#leftCol').addClass('fixedBottom').removeClass('fixedTop');
            } else {
                $('#leftCol').removeClass('fixedTop fixedBottom');
            }
        }
    });

    /*
     * Expand/Collapse Pagelet Sidebar Horizontally
     */
    $(document).on('mouseenter', '.fbChatSidebar', function () {
        $pagelet = $('#pagelet_sidebar');
        $sidebar = $(this);
        if ($sidebar.children('#chatSidebarSlider').length == 0) {
            $(`<span id="chatSidebarSlider"></span>`).click(function () {
                var margin = $pagelet.hasClass('collapsed') ? 0 : -$sidebar.width();
                $sidebar.animate({ marginRight: margin }, function () {
                    $pagelet.toggleClass('collapsed');
                });
            }).appendTo($sidebar);
        }
    });
});

/*
 * Show "Trending Posts" above content area
 */
$(document).bind('wpr:onload', function () {
    var $trending = $('#pagelet_work_trending_rhc_unit');

    // set hover position to below
    var setHoverBelow = function () {
        $trending.find('a[data-hovercard-position]')
            .attr('data-hovercard-position', 'below');
    }

    if ($trending.is(':empty')) {
        var trendingObserver = new MutationObserver(function (mutation) {
            if (mutation[0].addedNodes) {
                setHoverBelow();
            }
        });
        trendingObserver.observe($trending[0], { childList: true });
    } else {
        setHoverBelow();
    }
});

/*
 * Place "Scroll to Top" button at the bottom right of the page
 */
$(document).bind('wpr:onload', function () {
    var $scrollToTop = $('<div id="scrollToTop"><a href="#" title="Scroll to Top">'
        + '<i class="img"></i></a></div>');
    $('#contentArea').after($scrollToTop);

    $('#scrollToTop a').click(function () {
        $('body, html').animate({ scrollTop: 0 }, 'slow');
        return false;
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $scrollToTop.fadeIn('slow');
        } else {
            $scrollToTop.fadeOut('slow');
        }
    });

    var setMarginLeft = function () {
        $scrollToTop.css('marginLeft', $('#contentArea').width());
    }
    setMarginLeft();
    $(window).resize(setMarginLeft);
});
