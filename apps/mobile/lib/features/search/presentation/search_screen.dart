import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const TextField(
          decoration: InputDecoration(
            hintText: 'Cari nama kos atau daerah...',
            border: InputBorder.none,
          ),
        ),
      ),
      body: const Center(
        child: Text('Hasil pencarian akan tampil di sini'),
      ),
    );
  }
}
