import React, { useEffect, useState } from 'react';
import useStyles from './styles';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ButtonBase,
} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { timeAgo } from '../../../utils/helpers';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import jwtDecode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

const Post = (props) => {
  const classes = useStyles();
  const { setCurrentId } = props;
  const {
    _id,
    title,
    selectedFile,
    creator,
    name,
    createdAt,
    tags,
    message,
    likes,
  } = props?.post;
  const dispatch = useDispatch();
  const history = useHistory();
  const [userInfo, setUserInfo] = useState('');
  const [userLike, setUserLike] = useState(likes);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('token'))?.token;
    if (user) {
      setUserInfo(jwtDecode(user));
    }
  }, []);

  const hasLikedPost = likes.find((like) => like === userInfo?._id);

  const handleLike = async () => {
    dispatch(likePost(_id));

    if (hasLikedPost) {
      setUserLike(likes.filter((id) => id !== userInfo?._id));
    } else {
      setUserLike([...likes, userInfo?._id]);
    }
  };

  const Likes = () => {
    if (userLike.length > 0) {
      return userLike.find((like) => like === userInfo?._id) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {userLike.length > 2
            ? `You and ${userLike.length - 1} others`
            : `${userLike.length} like${userLike.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{userLike.length} {userLike.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const openPost = () => {
    history.push(`/posts/${_id}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={selectedFile}
          title={title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2">{timeAgo(createdAt)}</Typography>
        </div>

        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {tags.map((tag) => `#${tag}`)}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {message}
          </Typography>
        </CardContent>
      </ButtonBase>

      {userInfo?.sub === creator && (
        <div className={classes.overlay2}>
          <Button
            style={{ color: 'white', justifyContent: 'flex-end' }}
            size="small"
            onClick={() => setCurrentId(_id)}
          >
            <EditIcon fontSize="medium" />
          </Button>
        </div>
      )}

      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          onClick={handleLike}
          disabled={!userInfo}
        >
          <Likes />
        </Button>
        {userInfo?.sub === creator && (
          <Button
            size="small"
            color="primary"
            onClick={() => dispatch(deletePost(_id))}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
