$(()=>{
    let allUsers = $('.user-list')
    let postButton = $('.posts-btn')
    let followersButton = $('.followers-btn')
    let followingsButton = $('.followings-btn')
    let profileLists = $('.profile-lists')

    function showUsers(){
        allUsers.empty();       
        $.get('/api/allusers', (data)=>{
            for(let curUser of data){
                allUsers.append(
                    $('<li>').append(
                        $('<div>').attr('class', 'user-tile')
                            .append(
                                $('<i>').attr('class', `fa fa-user`)
                            )
                            .append(
                                $('<a>').attr('href', `/profile/${curUser._id}`).text(curUser.username)
                            )
                            .append(
                                $('<button>').attr('class', 'follow-btn').text('Follow')
                                    .on('click', (ev)=>{
                                        let newCall = `/api/follow/${curUser._id}`
                                        $.get(newCall, (data2)=>{
                                            showUsers()
                                            refreshExplorePosts()
                                        })
                                        
                                    })
                            )
                    )
                )
            }
        })
    }

    showUsers()
    
});
