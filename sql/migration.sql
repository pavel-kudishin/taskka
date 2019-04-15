SET XACT_ABORT ON
BEGIN TRAN tr1

IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    CREATE TABLE [Boards] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        CONSTRAINT [PK_Boards] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    CREATE TABLE [Statuses] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [BoardId] int NOT NULL,
        CONSTRAINT [PK_Statuses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Statuses_Boards_BoardId] FOREIGN KEY ([BoardId]) REFERENCES [Boards] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    CREATE TABLE [Tasks] (
        [Id] int NOT NULL IDENTITY,
        [Summary] nvarchar(max) NULL,
        [StatusId] int NOT NULL,
        CONSTRAINT [PK_Tasks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Tasks_Statuses_StatusId] FOREIGN KEY ([StatusId]) REFERENCES [Statuses] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    CREATE INDEX [IX_Statuses_BoardId] ON [Statuses] ([BoardId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    CREATE INDEX [IX_Tasks_StatusId] ON [Tasks] ([StatusId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415170824_Initial')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190415170824_Initial', N'2.2.4-servicing-10062');
END;

GO

COMMIT TRAN tr1
