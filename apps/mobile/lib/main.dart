import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/routing/app_router.dart';

void main() {
  runApp(
    const ProviderScope(
      child: TangerangKostApp(),
    ),
  );
}

class TangerangKostApp extends ConsumerWidget {
  const TangerangKostApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    
    return MaterialApp.router(
      title: 'TangerangKost',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF00288E)),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}
