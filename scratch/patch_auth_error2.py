import re

with open('apps/api/src/auth/auth.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'  async login\(loginDto: LoginDto\) \{.*?return this\.generateTokens\(user\.id, user\.email, user\.role\);\n  \}'

replacement = """  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOne({ email: loginDto.email });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      if (!user.passwordHash) throw new UnauthorizedException('Silakan masuk menggunakan akun Google Anda');
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
      return await this.generateTokens(user.id, user.email, user.role);
    } catch (e: any) {
      throw new import('@nestjs/common').HttpException({ message: "DEBUG ERROR", error: e.message, stack: e.stack }, 400);
    }
  }"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('apps/api/src/auth/auth.service.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
