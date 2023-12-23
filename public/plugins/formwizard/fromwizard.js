(function ($) {
    "use strict";

    // Toolbar extra buttons
    let btnFinish = $('<button></button>').text('Finish')
        .addClass('btn btn-success')
        .on('click', function () {
            let host = $('#host').val();
            let port = $('#port').val();
            let time = $('#time').val();
            let checked = $('#confirm').checked;

            let notyf = new Notyf();

            console.log(document.getElementById('confirm').checked);

            if (host && port && time) {

            } else {
                notyf.error('Missing form data');
            }
        });
    let btnCancel = $('<button></button>').text('Cancel')
        .addClass('btn btn-danger')
        .on('click', function () {
            $('#smartwizard').smartWizard("reset");
        });


    // Smart Wizard
    $('#smartwizard').smartWizard({
        selected: 0,
        theme: 'default',
        transitionEffect: 'fade',
        showStepURLhash: true,
        toolbarSettings: {
            toolbarButtonPosition: 'end',
            toolbarExtraButtons: [btnFinish, btnCancel]
        }
    });

    // Arrows Smart Wizard 1
    $('#smartwizard-1').smartWizard({
        selected: 0,
        theme: 'arrows',
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: {
            toolbarExtraButtons: [btnFinish, btnCancel]
        }
    });

    // Circles Smart Wizard 1
    $('#smartwizard-2').smartWizard({
        selected: 0,
        theme: 'circles',
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: {
            toolbarExtraButtons: [btnFinish, btnCancel]
        }
    });

})(jQuery);