window.onload = () => {
    /*
     * debouncing function: For those of you who don't know what a debounce function does, 
     * it limits the rate at which a function can fire.
     * One of the biggest mistakes I see when looking to optimize existing code is
     * the absence of the debounce function.  If your web app uses JavaScript to accomplish taxing tasks,
     *  a debounce function is essential to ensuring a given task doesn't fire so often that it bricks 
     *  browser performance.
     */
    let terms = ['apple', 'acorn', 'bee', 'beet', 'beef', 'bunny', 'cookie', 
                 'corn', 'corndog', 'dog', 'dogma', 'echo', 'elephant'];
    localStorage.setItem('server data', JSON.stringify(terms));
    function debounce(func,wait,immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context,args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later,wait);
            if (callNow) func.apply(context, args);
        };
    };
    function getData(txt) {
        return new Promise((resolve,reject)=>{
           let emulateServer = Math.floor(Math.random()*1000);
           setTimeout( (function(){
              let t = '^' + this.toString();
              let pattern = new RegExp(t,'i'); // start with t
              let terms = JSON.parse(localStorage.getItem('server data'));
              let matches = terms.filter(term => pattern.test(term));
              console.log('matches', matches);
              resolve(matches);
           }).bind(txt),emulateServer);
        });
    };
    let search = debounce(function(ev){
        let text = ev.target.value;
        document.querySelector('#output').textContent = `List matching ${text}`;
        let ul = document.querySelector('#matches');
        // call an asynchronous search to match what has been typed
        getData(text).then((list)=>{
           ul.textContent= '';
           if (list.length == 0 || text === '') {
               let li = document.createElement('li');
               li.textContent = "NO MATCHES";
               ul.appendChild(li);
           }
           else {
              list.forEach ( (item) => {
                 let li = document.createElement('li');
                 li.textContent = item;
                 ul.appendChild(li);
              });
           }
        }).catch(error => console.log(error));
    },300);
    document.querySelector('#txt-search').addEventListener('input',search);
};
