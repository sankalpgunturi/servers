from setuptools import setup, find_packages

setup(
    name="zendesk-mcp-server",
    version="0.1.0",
    description="A Model Context Protocol server for Zendesk",
    author="Sankalpgunturi",
    author_email="sgunturi@protonmail.com",
    packages=find_packages(),
    install_requires=[
        "mcp>=1.1.2",
        "python-dotenv>=1.0.1",
        "zenpy>=2.0.56",
        "cachetools>=5.5.0",
    ],
    entry_points={
        "console_scripts": [
            "zendesk=zendesk_mcp_server:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.12",
)
