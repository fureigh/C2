$(document).ready(function() {

  var searchUI = $(".m-search-ui");
  var advOptsFieldset = $("fieldset.adv");
  var advOptsControlsFieldset = $("fieldset.controls");
  var searchTerms = $(".m-search-ui .search-terms");
  var searchButton = $("#search-button");
  var searchMagGlass = $(".m-search-ui .input-group-addon.magnifier");
  var advOptsButton = $("#adv-options");
  var advOptsToggler = $("a.adv-options");
  var advOptsCloser = $(".adv-controls .closer");
  var allSearchButtons = $(".m-search-ui button.search");
  var searchForm = $("form.search");
  var countEl = $(".results-count-preview .count");
  var advOptsResetter = $("a.resetter");

  var advOptionsVisible = function() {
    return advOptsFieldset.is(":visible");
  };

  var FADE_SPEED = 200;

  // manage the basic search input button via the search-terms field
  var buttonToggler = function() {
    if (searchTerms && searchTerms.val() && searchTerms.val().length == 0) {
      searchButton.hide();
      searchMagGlass.fadeIn(FADE_SPEED);
    }
    else {
      if (!advOptionsVisible()) {
        advOptsButton.fadeIn(FADE_SPEED);
      }
      searchMagGlass.hide();
      searchButton.fadeIn(FADE_SPEED);
    }
  };

  var showAdvOptions = function() {
    advOptsFieldset.fadeIn(FADE_SPEED);
    advOptsControlsFieldset.show();
    advOptsButton.hide();
    searchButton.hide();
    searchMagGlass.show();
    searchUI.addClass("expanded");
  };
  var hideAdvOptions = function() {
    advOptsFieldset.hide();
    advOptsControlsFieldset.hide();
    advOptsButton.fadeIn(FADE_SPEED);
    buttonToggler();
    searchUI.removeClass("expanded");
  };
  advOptsToggler.click(function(e) {
    showAdvOptions();
    return false;
  });

  advOptsCloser.click(function() {
    hideAdvOptions();
    return false;
  });

  // initial visibility
  // open the Adv Search UI immediately if param set 
  if (typeof C2_SEARCH_UI_OPEN != "undefined" && C2_SEARCH_UI_OPEN === true ) {
    showAdvOptions();
  }
  else {
    hideAdvOptions();
    buttonToggler();
  }

  // listen for change on basic search box
  searchTerms.keyup(function(e) {
    if (!advOptionsVisible()) {
      buttonToggler();
    }
  });

  searchTerms.focusin(function() {
    if (!advOptionsVisible()) {
      advOptsButton.fadeIn(FADE_SPEED);
    }
  });

  searchTerms.focusout(function(e) {
    if (searchTerms.val().length == 0) {
      // use timeout to workaround click on adv-options button,
      // so that the click event can also fire.
      setTimeout(function() { advOptsButton.hide(FADE_SPEED); }, 200);
    }
  });

  // disable the form when we submit it
  allSearchButtons.click(function() {
    var btn = $(this);
    searchForm.submit();
    // IMPORTANT disable *AFTER* submit
    searchForm.find('fieldset').prop("disabled", true);
    btn.prop("disabled", true);
  });

  // fetch search total for preview count
  var previewCountTimer = 0;
  var previewCountUrl = "";
  var updatePreviewCount = function() {
    countEl.html('<i class="fa fa-spinner fa-pulse"></i>');
    var getParams = searchForm.serialize();
    var url = searchForm.attr('action') + '_count?' + getParams;
    if (url == previewCountUrl) {
      return;
    }
    previewCountUrl = url;

    if (previewCountTimer) {
      clearTimeout(previewCountTimer);
    }

    previewCountTimer = setTimeout(function() {
      $.get(url, function(resp) {
        countEl.html(resp.total);
      }).fail(function(xhr, err, msg) {
        console.log('fail!', msg);
      });
    }, 1000); // TODO experiment with this delay
  };

  // if any adv search form inputs change, fetch new preview total
  // the 'keyup' listener handles text input immediately (change waits for focus change)
  searchForm.find(':input').keyup(function(e) {
    var el = $(e.target);
    //console.log('adv search keyup: ', el[0].name);
    updatePreviewCount();
  });
  // the 'onchange' listener handles select/checkbox/radio immediately
  searchForm.find(':input').change(function(e) {
    var el = $(e.target);
    //console.log('adv search change: ', el[0].name);
    updatePreviewCount();
  });

  advOptsResetter.click(function() {
    searchForm[0].reset();
    updatePreviewCount();
    return false;
  });

  searchTerms.keyup(function(e) {
    if (e.keyCode === 13) {
      searchButton.trigger("click");
    }
  });
});
