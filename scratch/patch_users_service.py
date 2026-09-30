import re

path = 'apps/api/src/users/users.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

methods = """
  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        kos: {
          include: {
            kosImages: { orderBy: { order: 'asc' } },
          }
        }
      }
    });
    return favorites.map(f => f.kos);
  }

  async toggleFavorite(userId: string, kosId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_kosId: { userId, kosId } }
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_kosId: { userId, kosId } }
      });
      return { status: 'removed' };
    } else {
      await this.prisma.favorite.create({
        data: { userId, kosId }
      });
      return { status: 'added' };
    }
  }
}
"""

content = re.sub(r"\}\s*$", methods, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
