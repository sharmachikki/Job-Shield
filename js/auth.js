// small auth helper (keeps simple token handling for demo)
(function(){
  // helper to attach Authorization header for fetch if token present
  const oldFetch = window.fetch;
  window.fetch = function(resource, init){
    const token = localStorage.getItem('accessToken');
    init = init || {};
    init.headers = init.headers || {};
    if(token && !init.headers['Authorization']){
      init.headers['Authorization'] = 'Bearer ' + token;
    }
    return oldFetch(resource, init);
  };
})();
