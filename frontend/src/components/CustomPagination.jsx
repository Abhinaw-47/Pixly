import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post";

const CustomPagination = ({ page }) => {
  const { numberOfPages } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [page, dispatch]);

  return (
    <Pagination
      count={numberOfPages || 1}
      page={Number(page) || 1}
      variant="outlined"
      shape="rounded"
      sx={{
        '& .MuiPaginationItem-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          background: 'rgba(28, 28, 45, 0.5)',
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            borderColor: '#00FFFF',
            color: '#00FFFF',
          },
          '&.Mui-selected': {
            backgroundColor: '#00FFFF',
            color: '#000000',
            borderColor: '#00FFFF',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
          },
        },
      }}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  );
}

export default CustomPagination;