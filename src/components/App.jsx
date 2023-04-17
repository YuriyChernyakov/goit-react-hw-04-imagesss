import { useEffect, useState } from "react";
import Searchbar from './Searchbar/searchbar';
import Button from './Button/button';
import ImageGallery from './ImageGallery/imageGallery';
import Loader from './Loader/loader';
import Modal from './Modal/modal';
import css from './styles.module.css';

const KEYCODE_ESC = 27;

export default function App() {
  const [articles, setArticles] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    document.addEventListener('keydown', keyDownEventsHandle);

    return () => {
      document.removeEventListener('keydown', keyDownEventsHandle);
    }
  }, []);

  useEffect(() => {
    if (page !== 0) {
      setIsLoading(true)
      fetch(`https://pixabay.com/api/?q=${searchName}&page=${page}&key=33018629-fbe0e3699e0e90be35e2ad394&image_type=photo&orientation=horizontal&per_page=12`)
        .then(res => res.json())
        .then((res) => {
        console.log(res);
          setArticles([...articles, ...res.hits])
          setIsLoading(false)
        })
    }
  }, [page])

  const keyDownEventsHandle = (e) => {
    const isEscButton = e.keyCode === KEYCODE_ESC;

    switch (true) {
      case isEscButton:
        return closeModal();

      default:
        return null;
    }
  };

  const closeModal = (e) => {
    if (e !== undefined) {
      if (e.target.tagName === 'IMG') return false;
    }
    setModalItem(null)
  };

  const findImg = (event) => {
    let count = page;
    setPage(count +=1);
    setIsLoading(true)
    event.preventDefault();
    fetch(`https://pixabay.com/api/?q=${searchName}&page=1&key=33018629-fbe0e3699e0e90be35e2ad394&image_type=photo&orientation=horizontal&per_page=12`)
      .then(res => res.json())
      .then(res => setArticles(res.hits),
        setIsLoading(false))
  }
        

  const onPush = (id) => {
    setModalItem(articles.find((item) =>
      item.id === id,
    ))
  }


  const pushBut = () => {
    console.log();
    let count = page;
    setPage(count +=1);
  }
  
    const newSearchName = (event) => {
      setSearchName(event.target.value,
      )
    }


    return (
      <div className={css.app}>
        <Searchbar
          findName={newSearchName}
          onSubmit={findImg}
        />
        <ImageGallery
      onPushUl={onPush}
      newGallery={articles} />
    {articles.length !== 0 ?
      <Button className={css.findButton} onPushBut={pushBut} /> : null
    }
    {isLoading ? <Loader
    /> : null}
    {modalItem !== null ?
      <Modal
        closeModal={closeModal}
        item={modalItem}
      />
      : null
    }
      </div>
    )
  }