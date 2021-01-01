import React, { useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { Message } from 'semantic-ui-react';

const SUBSCRIBE_POST_ADDED = gql`
  subscription {
    newPost {
      id
      username
      createdAt
      body
      comments {
        createdAt
      }
      likes {
        createdAt
      }
    }
  }
`;

const NewPostNotification = () => {
  const [visible, setVisible] = useState(true);
  const { data, error, loading } = useSubscription(SUBSCRIBE_POST_ADDED, {
    update(proxy, result) {
      console.log(result);
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleDismiss = () => {
    setVisible(false);
  };

  if (loading) {
    return <></>;
  }
  if (error) {
    return <div> Error! {error.message} </div>;
  }
  let { username, body } = data.newPost;
  if (visible) {
    return (
      <Message
        positive
        compact
        onDismiss={handleDismiss}
        header={`New Post from: ${username}`}
        content={body}
        className="notification"
      />
    );
  } else {
    return <></>;
  }
};

export default NewPostNotification;
