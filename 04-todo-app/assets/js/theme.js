
(() => {
    const setTheme = theme => {
        if(theme === 'light') return document.body.classList.remove('dark');
        document.body.classList.add('dark');
    }

    /* Local storage theme or system theme */
    setTheme(
        localStorage.getItem('userSelectedTheme') ?? 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
        setTheme(matches ? 'dark' : 'light');
    });

    const changeThemeBtn = document.querySelector('#changeThemeBtn');

    if(changeThemeBtn){
        changeThemeBtn.addEventListener('click', (event) => {
            const selectedTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('userSelectedTheme', selectedTheme);
            setTheme(selectedTheme);
        });
    }
})()