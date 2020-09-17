function phone_formatting(ele, restore) {
    var new_number,
        selection_start = ele.selectionStart,
        selection_end = ele.selectionEnd,
        number = ele.value.replace(/\D/g, '');

    // automatically add dashes
    if (number.length > 2) {
        // matches: 123 || 123-4 || 123-45
        new_number = number.substring(0, 3) + '-';
        if (number.length === 4 || number.length === 5) {
            // matches: 123-4 || 123-45
            new_number += number.substr(3);
        }
        else if (number.length > 5) {
            // matches: 123-456 || 123-456-7 || 123-456-789
            new_number += number.substring(3, 6) + '-';
        }
        if (number.length > 6) {
            // matches: 123-456-7 || 123-456-789 || 123-456-7890
            new_number += number.substring(6);
        }
    }
    else {
        new_number = number;
    }

    // if value is higher than 12, last number is dropped
    // if inserting a number before the last character, numbers
    // are shifted right, only 12 characters will show
    ele.value = (new_number.length > 13) ? new_number.substring(0, 13) : new_number;

    // restore cursor selection
    // prevent it from going to the end
    // UNLESS
    // cursor was at the end AND a dash was added
    // document.getElementById('msg').innerHTML = '<p>Selection is: ' + selection_end + ' and length is: ' + new_number.length + '</p>';

    if (new_number.slice(-1) === '-' && restore === false
        && (new_number.length === 8 && selection_end === 7)
        || (new_number.length === 4 && selection_end === 3)) {
        selection_start = new_number.length;
        selection_end = new_number.length;
    }
    else if (restore === 'revert') {
        selection_start--;
        selection_end--;
    }
    ele.setSelectionRange(selection_start, selection_end);

}

function phone_number_check(field, e) {
    var key_code = e.keyCode,
        key_string = String.fromCharCode(key_code),
        press_delete = false,
        dash_key = 189,
        delete_key = [8, 46],
        direction_key = [33, 34, 35, 36, 37, 38, 39, 40],
        selection_end = field.selectionEnd;

    // delete key was pressed
    if (delete_key.indexOf(key_code) > -1) {
        press_delete = true;
    }

    // only force formatting is a number or delete key was pressed
    if (key_string.match(/^\d+$/) || press_delete) {
        phone_formatting(field, press_delete);
    }
    // do nothing for direction keys, keep their default actions
    else if (direction_key.indexOf(key_code) > -1) {
        // do nothing
    }
    else if (dash_key === key_code) {
        if (selection_end === field.value.length) {
            field.value = field.value.slice(0, -1)
        }
        else {
            field.value = field.value.substring(0, (selection_end - 1)) + field.value.substr(selection_end)
            field.selectionEnd = selection_end - 1;
        }
    }
    // all other non numerical key presses, remove their value
    else {
        e.preventDefault();
        //    field.value = field.value.replace(/[^0-9\-]/g,'')
        phone_formatting(field, 'revert');
    }

}
$(document).ready(function () {
    document.getElementById('phone').onkeyup = function (e) {
        phone_number_check(this, e);
    }
})