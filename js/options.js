$(function () {
    loadOptions();
    $('#save').click(saveOptions);
    $('#reset').click(resetOptions);
    $('input[type="color"]').change(function () {
        $(this).prev('input').val($(this).val());
    });

    function loadOptions() {
        chrome.storage.sync.get({
            sidebarDisplay: false,
            trendingDisplay: true,
            color: '#365899',
            bgColor: '#ffff00'
        }, function (items) {
            $('#sidebarDisplay').prop('checked', items.sidebarDisplay);
            $('#trendingDisplay').prop('checked', items.trendingDisplay);
            $('#mentionColor').next('input').andSelf().val(items.color);
            $('#mentionBgColor').next('input').andSelf().val(items.bgColor);
        });
    }

    function saveOptions() {
        var sidebarDisplay = $('#sidebarDisplay').prop('checked');
        var trendingDisplay = $('#trendingDisplay').prop('checked');
        var color = $('#mentionColor').val();
        var bgColor = $('#mentionBgColor').val();
        chrome.storage.sync.set({
            sidebarDisplay: sidebarDisplay,
            trendingDisplay: trendingDisplay,
            color: color,
            bgColor: bgColor
        }, function () {
            $('#mentionColor + input').val(color);
            $('#mentionBgColor + input').val(bgColor);
            updateStatus('Options saved.');
        });
    }

    function resetOptions() {
        chrome.storage.sync.clear(function () {
            loadOptions();
            updateStatus('Options reset.');
        });
    }

    function updateStatus(message) {
        var $status = $('#status');
        $status.text(message);
        setTimeout(function () {
            $status.fadeOut('slow', function () {
                $status.text('').show();
            });
        }, 2000);
    }
});