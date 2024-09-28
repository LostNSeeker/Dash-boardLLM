export const sendQueryToLLMWithImage = async (query, image, uid) => {
    const formData = new FormData();
    formData.append('query', query);
    formData.append('uid', uid);
    if (image) {
      formData.append('image', image);
    }
  
    const response = await fetch('/api/queryWithImage', {
      method: 'POST',
      body: formData,
    });
  
    return await response.json();
  };
  
  export const fetchUserChats = async (uid) => {
    const response = await fetch(`/api/userChats?uid=${uid}`);
    return await response.json();
  };
  