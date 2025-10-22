"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";

type Product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  price: string | number;
  stock_quantity: number;
  sku?: string;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  async function fetchProducts(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${p}&limit=${limit}`);
      const json = await res.json();
      if (json.ok) setProducts(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/generate`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        // after generating, refresh first page
        fetchProducts(1);
        setPage(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Box p={8}>
      <Stack direction="row" justify="space-between" align="center" mb={6}>
        <Heading size="lg">Products</Heading>
        <Button colorScheme="teal" onClick={generate} isLoading={loading}>
          Generate 100 Products
        </Button>
      </Stack>

      {loading && products.length === 0 ? (
        <Spinner />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {products.map((p) => (
            <Box key={p.id} borderWidth="1px" borderRadius="md" p={4}>
              <Heading size="sm">{p.name}</Heading>
              <Text fontSize="sm" color="gray.600">
                {p.description}
              </Text>
              <Text mt={2}>
                <strong>Brand:</strong> {p.brand} • <strong>Category:</strong>{" "}
                {p.category}
              </Text>
              <Text mt={2}>
                <strong>Price:</strong> ${p.price} • <strong>Stock:</strong>{" "}
                {p.stock_quantity}
              </Text>
              <Text mt={2} fontSize="xs" color="gray.500">
                SKU: {p.sku}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={6}>
        <Box />
        <Box textAlign="center">
          <Button
            mr={4}
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Button onClick={() => setPage((s) => s + 1)}>Next</Button>
          <Text mt={2}>Page {page}</Text>
        </Box>
        <Box textAlign="right">
          <Button onClick={() => fetchProducts(page)}>Refresh</Button>
        </Box>
      </Grid>
    </Box>
  );
}
