import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  DioClient()
      : _dio = Dio(BaseOptions(
          baseUrl: const String.fromEnvironment('API_URL',
              defaultValue: 'http://10.0.2.2:3000/api/v1'),
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
        )) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'accessToken');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          if (e.response?.statusCode == 401) {
            final refreshToken = await _storage.read(key: 'refreshToken');
            if (refreshToken != null) {
              try {
                final response = await _dio.post('/auth/refresh', data: {
                  'refreshToken': refreshToken,
                });

                final newAccessToken = response.data['accessToken'];
                final newRefreshToken = response.data['refreshToken'];

                await _storage.write(key: 'accessToken', value: newAccessToken);
                await _storage.write(key: 'refreshToken', value: newRefreshToken);

                e.requestOptions.headers['Authorization'] =
                    'Bearer $newAccessToken';
                final cloneReq = await _dio.request(
                  e.requestOptions.path,
                  options: Options(
                    method: e.requestOptions.method,
                    headers: e.requestOptions.headers,
                  ),
                  data: e.requestOptions.data,
                  queryParameters: e.requestOptions.queryParameters,
                );

                return handler.resolve(cloneReq);
              } catch (refreshError) {
                await _storage.deleteAll();
                // TODO: Redirect to login via GoRouter
              }
            }
          }
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
