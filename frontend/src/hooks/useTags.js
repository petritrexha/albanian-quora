import { useEffect, useState } from "react";
import { getTags } from "../api/tagApi";

export default function useTags(categoryId) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      if (!categoryId) {
        setTags([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getTags(categoryId);
        setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [categoryId]);

  return { tags, loading };
}