import re

with open('apps/api/src/auth/auth.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Wrap the login function in try/catch
old_login = """  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (!user.passwordHash) {
      throw new UnauthorizedException('Silakan masuk menggunakan akun Google Anda');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }"""

new_login = """  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOne({ email: loginDto.email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      if (!user.passwordHash) {
        throw new UnauthorizedException('Silakan masuk menggunakan akun Google Anda');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return await this.generateTokens(user.id, user.email, user.role);
    } catch (error: any) {
      throw new import('@nestjs/common').HttpException(
        { message: 'Login Error', error: error.message, stack: error.stack }, 
        400
      );
    }
  }"""

if 'try {' not in content:
    content = content.replace(old_login, new_login)
    with open('apps/api/src/auth/auth.service.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched auth.service.ts")
else:
    print("Already patched")
