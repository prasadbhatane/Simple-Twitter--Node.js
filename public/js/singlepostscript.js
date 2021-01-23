$(()=>{
    let allUsers = $('.user-list')
    let allcomments = $('.home-all-posts')

    function refreshComments(){
        allcomments.empty();       
        let parPostID = $('.hidden-inp').val()    
        $.get(`/api/comment/${parPostID}`, (data)=>{
            for(let post of data){
                allcomments.append(
                    $('<li>').append(
                        $('<div>').attr('class', 'post-card')
                            .append(
                                $('<div>').attr('class', 'post-card-row1')
                                    .append(
                                        $('<div>').attr('class', 'post-card-row1-col1')
                                            .append(
                                                $('<i>').attr('class', 'fa fa-user')
                                            )
                                    )
                                    .append(
                                        $('<div>').attr('class', 'post-card-row1-col2')
                                            .append(
                                                $('<h3>').text(post.authorUsername)
                                            )
                                            .append(
                                                $('<div>').text(`📧 ${post.authorEmail}`)
                                            )
                                    )
                                    .append(
                                        $('<div>').attr('class', 'post-card-row1-col3')
                                            .text(post.date)
                                    )
                            )
                            .append(
                                $('<div>').attr('class', 'post-card-row2')
                                    .append($('<hr>'))
                                    .append($('<p>').text(post.content))
                                    .append($('<hr>'))
                            )
                            .append(
                                $('<div>').attr('class', 'post-card-row3')
                                    .append(
                                        $('<a>').attr('class', `fa fa-heart ${post.curLikeBoolean}`)
                                            .on('click', (ev)=>{
                                                let bt = $(ev.target)
                                                if (bt.attr('class') === 'fa fa-heart red'){
                                                    $.get(`/api/commentdislike/${post._id}`, (data)=>{
                                                        refreshComments()
                                                    })
                                                    bt.attr('class', 'fa fa-heart blue')
                                                }
                                                else if(bt.attr('class') === 'fa fa-heart blue'){
                                                    $.get(`/api/commentlike/${post._id}`, (data)=>{
                                                        refreshComments()
                                                    })
                                                    bt.attr('class', 'fa fa-heart red')
                                                }
                                            })
                                            .append($('<i>').text(post.LikedBy.length)))
                            )
                    )
                )
            }
        })
    }

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
                                            refreshComments()
                                        })
                                        
                                    })
                            )
                    )
                )
            }
        })
    }

    refreshComments()
    showUsers()
    
});