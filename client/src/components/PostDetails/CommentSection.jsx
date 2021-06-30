import React, {useState, useRef} from 'react'
import {Typography, TextField, Button} from '@material-ui/core'
import {useDispatch} from 'react-redux'

import useStyles from './styles'

const CommentSection = ({post}) => {
    const classes = useStyles()
    const [comments, setComments] = useState([1, 2, 3, 4])
    const [comment, setComment] = useState('')
    return (
        <div>
            <div className = {classes.commentsOuterContainer}>
                <div className = {classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6"></Typography>
                    {comments.map((c, i) => (
                        <Typography key = {i} gutterBottom variant="subtitle1">
                            Comment Section {i}
                        </Typography>
                    ))}
                </div>
                <div style={{width: '70%'}}>
                    <Typography gutterBottom variant="h6">
                        Write a Comment...
                    </Typography>
                    <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)}/>
                </div>
            </div>
        </div>
    )
}

export default CommentSection
