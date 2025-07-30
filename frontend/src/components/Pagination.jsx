import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post";

function Paginate({ page }) {
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
      color="primary"
      sx={{
        ".MuiPaginationItem-root": {
          borderColor: "#3b82f6", 
          color: "#fff",
          backgroundColor: "rgba(31, 41, 55, 0.6)", 
          '&.Mui-selected': {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
          '&:hover': {
            backgroundColor: "rgba(59, 130, 246, 0.2)",
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

export default Paginate;
